const Invoice = require("../models/Invoice");

// @desc Create new invoice
//@route POST /api/invoices
//access Private

exports.createInvoice = async (req, res) => {
    try {
        const user = req.user;
        const {
            invoiceNumber,
            invoiceDate,
            dueDate,
            billFrom,
            billTo,
            items,
            notes,
            paymentTerms
        } = req.body;

        let subTotal = 0;
        let taxTotal = 0;
        items.forEach(item => {
            subTotal += item.unitPrice * item.quantity
            taxTotal += ((item.unitPrice * item.quantity) * (item.taxPercent || 0)) / 100;
        });

        const total = subTotal + taxTotal;
        const invoice = new Invoice(
            user,
            invoiceNumber,
            invoiceDate,
            dueDate,
            billFrom,
            billTo,
            items,
            notes,
            paymentTerms,
            subTotal,
            taxTotal,
            total
        );
        await invoice.save();
        res.status(201).json(invoice)

    } catch (error) {
        res.status(400).json({ message: "Error create invoice", error: error.message });
    }
}

// @desc Get invoice
//@route GET /api/invoices
//access Private

exports.getInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.find().populate("user", "name email");
        res.json(invoice);
    } catch (error) {
        res.status(400).json({ message: "Error Get invoice", error: error.message });
    }
}


// @desc Get single invoice
//@route Get /api/invoices
//access Private

exports.getInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id).populate("user", "name email");
        if (!invoice) res.status(404).json({ message: "Invoice not found" });
        res.json(invoice);
    } catch (error) {
        res.status(400).json({ message: "Error Get single invoice", error: error.message });
    }
}


// @descUpdate invoice
//@route PUT /api/invoices
//access Private

exports.updateInvoice = async (req, res) => {
    try {
        const {
            invoiceNumber,
            invoiceDate,
            dueDate,
            billFrom,
            billTo,
            items,
            notes,
            paymentTerms,
            status
        } = req.body;
        let subTotal = 0;
        let taxTotal = 0;
        if (items && items.length > 0) {
            items.forEach((item) => {
                subTotal += item.unitPrice * item.quantity
                taxTotal += ((item.unitPrice * item.quantity) * (item.taxPercent || 0)) / 100;

            });
            const total = subTotal + taxTotal;
            const updateInvoice = await Invoice.findByIdAndUpdate(
                req.params.id,
                {
                    invoiceNumber,
                    invoiceDate,
                    dueDate,
                    billFrom,
                    billTo,
                    items,
                    notes,
                    paymentTerms,
                    subTotal,
                    taxTotal,
                    total
                },
                {
                    new: true
                }
            );
            if (!updateInvoice) return res.status(404).json({ message: "Invoice not found" });
            res.json(updateInvoice);
        }
    } catch (error) {
        res.status(400).json({ message: "Error update invoice", error: error.message });
    }
}

// @desc Delete invoice
//@route DELETE /api/invoices
//access Private

exports.deleteInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findByIdAndDelete(req.params.id);
        if (!invoice) return res.status(404).json({ message: "Invoice not found" });
        res.json({ message: "Invoice deleted successfully" });

    } catch (error) {
        res.status(400).json({ message: "Error delete invoice", error: error.message });
    }
} 