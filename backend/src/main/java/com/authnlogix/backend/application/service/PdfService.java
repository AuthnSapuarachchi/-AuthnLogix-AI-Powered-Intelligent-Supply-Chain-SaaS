package com.authnlogix.backend.application.service;

import com.authnlogix.backend.domain.model.Shipment;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
public class PdfService {

    public byte[] generateShipmentInvoice(Shipment shipment) {
        // 1. Create Document
        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // 2. Add Header
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, Color.BLUE);
            Paragraph title = new Paragraph("AuthnLogix - Shipment Invoice", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(Chunk.NEWLINE);

            // 3. Add Shipment Metadata
            Font dataFont = FontFactory.getFont(FontFactory.HELVETICA, 12);
            document.add(new Paragraph("Shipment ID: " + shipment.getId(), dataFont));
            document.add(new Paragraph("Date: " + shipment.getShipmentDate().format(DateTimeFormatter.ISO_DATE), dataFont));
            document.add(new Paragraph("Destination: " + shipment.getDestination(), dataFont));
            document.add(new Paragraph("Status: " + shipment.getStatus(), dataFont));
            document.add(Chunk.NEWLINE);

            // 4. Add Product Table
            PdfPTable table = new PdfPTable(4); // 4 Columns
            table.setWidthPercentage(100);

            // Headers
            addTableHeader(table, "Product Name");
            addTableHeader(table, "SKU");
            addTableHeader(table, "Quantity");
            addTableHeader(table, "Unit Price");

            // Data Rows
            table.addCell(shipment.getProduct().getName());
            table.addCell(shipment.getProduct().getSku());
            table.addCell(String.valueOf(shipment.getQuantity()));
            table.addCell("$" + shipment.getProduct().getPrice());

            document.add(table);

            // 5. Add Footer / Signature Line
            document.add(Chunk.NEWLINE);
            document.add(Chunk.NEWLINE);
            document.add(new Paragraph("_____________________________"));
            document.add(new Paragraph("Authorized Signature"));

            document.close();

        } catch (DocumentException e) {
            throw new RuntimeException("Error generating PDF", e);
        }

        return out.toByteArray();
    }

    private void addTableHeader(PdfPTable table, String headerTitle) {
        PdfPCell header = new PdfPCell();
        header.setBackgroundColor(Color.LIGHT_GRAY);
        header.setPhrase(new Phrase(headerTitle));
        table.addCell(header);
    }

}
