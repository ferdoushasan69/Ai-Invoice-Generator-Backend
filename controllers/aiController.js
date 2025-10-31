const { GoogleGenAI } = require("@google/genai");
const Invoice = require("../models/Invoice");
const { param } = require("../routes/authRoutes");
const { model } = require("mongoose");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const parseInvoiceFromText  = async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ message: "Text is required" });
    }
    try {
        const promt = `Your are an expert invoice data extraction AI.
        Analyze the following text and extract the relevent information to create an invoice.
        The output must be a valid JSON object.

        The json object should have the following structure : 
        {
        clientName : "string",
        email : "string (if available)",
        address : "string (if available)",
        items :[
        {
        name : "string",
        quantity : "number",
        unitPrice : "number"
        }
     ]
    }
     Here is the text to parse : 
     --Text start--
     ${text}
     --Text end--
     Extract the data and provide only the json object.
         `;

        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash-latest",
            contents: promt
        });

        const responseText = response.text;

        if (typeof responseText !== 'string') {
            if (typeof response.text === 'function') {
                responseText = response.text();
            } else {
                throw new Error("Couldn't extract from ai response");

            }
        }

        const cleanedJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parseData = JSON.parse(cleanedJson);
        res.status(200).json(parseData);
    } catch (error) {
        console.log("Error parsing invoice with ai", error);
        res.status(500).json({ message: "Failed to parse text from gen ai", details: error.message });
    }
};

const generateReminderEmail = async (req, res) => {

    const { invoiceId } = req.body;
    if (!invoiceId) return res.status(400).json({ messsage: "Invoice id is reqired" });
    try {
        const invoice = await Invoice.findById(invoiceId);
        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }
        const prompt = `You are a professonal and polite accounting assistent.
        wrtite a friendly reminder email to a client about an overdue or upcoming invoice payment.
        
        Use the following details to personalize the email:
        - Client Name : ${invoice.billTo.clientName}
        - Invoice Number : ${invoice.invoiceNumber}
        - Amount Due : ${invoice.total.toFixed(2)}
        - Due Date : ${new Date(invoice.dueDate).toLocaleDateString()}
        `;
        const response = ai.models.generateContent({
            model: "gemini-1.5-flash-latest",
            contents: prompt
        });

        res.status(200).json({ reminderText: (await response).text });
    } catch (error) {
        console.log("Error generateReminderEmail invoice with ai", error);
        res.status(500).json({ message: "Failed to generateReminderEmail from gen ai", details: error.message });
    }
}

const getDashboardSummary = async (req, res) => {

    try {
        const invoice = await Invoice.find({ user: req.user.id });

        if (invoice.length === 0) {
            res.status(201).json({ insights: ["No invoice data available to generate insights."] });
        }

        //process and summurize data 
        const totalInvoice = invoice.length;
        const paidInvoice = invoice.filter(inv => inv.status === 'PAID');
        const unPaidInvoice = invoice.filter(inv => inv.status !== 'PAID');
        const totalRevenue = paidInvoice.reduce((acc, inv) => acc + inv.total, 0);
        const totalOutStanding = unPaidInvoice.reduce((acc, inv) => acc + inv.total, 0);

        const dataSummary = `
        - Total number of invoice : ${totalInvoice}
        - Total paid invoice : ${paidInvoice.length}
        - Total unpaid invoice/pending : ${unPaidInvoice.length}
        - Total revenue from paid invoice : ${totalRevenue.toFixed(2)}
        - Total outstanding amout from unpaid/pending invoice : ${totalOutStanding.toFixed(2)}
        - Recent invoice (last 5) : ${invoice.slice(0, 5).map(inv => `Invoice #${inv.invoiceNumber} for ${inv.total.toFixed(2)} with status ${inv.status}`).join(', ')}
        `;
        const prompt = `
        You are a friendly and insightfull analyst for a small business owner.
        Based on the following summary of their invoice data provide 2-3 concise and actionable insights.
        Each insights should be a sort string in a JSON array.
        The insights should be encouraging and helpful.Do not just repeat data
        for example : if there is a high outstanding amount, suggest sending reminders. if revenue is high  be encouraging.

        Data summry : 
        ${dataSummary}

        Return a response as a valid JSON object with a single key "insights" which is a array of string.
        Example format : {"insights : ["your revenue is looking strong this month","You have 5 overdue invoices. Consider sending reminders to get paid faster"]}
        `;

        const response = ai.models.generateContent({
            model: "gemini-1.5-flash-latest",
            contents: prompt
        });

        const responseText = response.text
        const cleanedJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parseData = JSON.parse(cleanedJson);
        res.status(201).json(parseData);

    } catch (error) {
        console.log("Error getDashboardSummary invoice with ai", error);
        res.status(500).json({ message: "Failed to getDashboardSummary from gen ai", details: error.message });
    }
}


module.exports = { parseInvoiceFromText , generateReminderEmail, getDashboardSummary };