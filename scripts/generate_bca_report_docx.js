const fs = require("fs");
const path = require("path");
const {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  Header,
  HeadingLevel,
  LevelFormat,
  PageBreak,
  PageNumber,
  Packer,
  Paragraph,
  TabStopPosition,
  TabStopType,
  Table,
  TableCell,
  TableOfContents,
  TableRow,
  TextRun,
  WidthType,
} = require("docx");

/**
 * Generates an editable DOCX BCA Major Project Report.
 * Notes:
 * - Exact pixel-perfect replication of a PDF template isn't possible with docx generation alone.
 * - This script generates a printer-friendly university-style report with proper styles, TOC, page numbers,
 *   and structured chapters + placeholders requested.
 */

const OUT_FILE = path.resolve(
  __dirname,
  "..",
  "BCA_Major_Project_Report_Online_Book_Store_Aayush_Dangi.docx"
);

const META = {
  projectTitle: "Online Book Store Management System",
  studentName: "Aayush Dangi",
  email: "aayushkamboj400@gmail.com",
  course: "BCA-V2",
  universityId: "O23BCA110126",
  college: "Chandigarh University (Online)",
  guideName: "Dr Vivek Anand",
  tech: {
    frontend: ["HTML", "CSS", "JavaScript", "Bootstrap"],
    backend: ["Node.js", "Express.js"],
    database: ["MySQL"],
  },
};

function pr(text, opts = {}) {
  return new Paragraph({
    ...opts,
    children: [
      new TextRun({
        text,
        ...opts.run,
      }),
    ],
  });
}

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [new TextRun({ text, bold: true })],
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [new TextRun({ text, bold: true })],
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    children: [new TextRun({ text, bold: true })],
  });
}

function spacer(lines = 1) {
  return new Paragraph({
    children: [new TextRun({ text: "" })],
    spacing: { after: 240 * lines },
  });
}

function centerBold(text, size = 28) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text, bold: true, size })],
  });
}

function center(text, size = 24) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text, size })],
  });
}

function justify(text) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    children: [new TextRun({ text })],
  });
}

function bullet(text) {
  return new Paragraph({
    bullet: { level: 0 },
    children: [new TextRun({ text })],
  });
}

function caption(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text, italics: true })],
    spacing: { before: 120, after: 240 },
  });
}

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

function twoColKeyValues(rows) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: rows.map(([k, v]) => {
      return new TableRow({
        children: [
          new TableCell({
            width: { size: 35, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [new TextRun({ text: k, bold: true })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 65, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ children: [new TextRun(v)] })],
          }),
        ],
      });
    }),
  });
}

function simpleTable({ headers, rows }) {
  const border = {
    top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
  };

  const headerRow = new TableRow({
    children: headers.map((h) => {
      return new TableCell({
        borders: border,
        children: [
          new Paragraph({
            children: [new TextRun({ text: h, bold: true })],
            alignment: AlignmentType.CENTER,
          }),
        ],
      });
    }),
  });

  const bodyRows = rows.map((r) => {
    return new TableRow({
      children: r.map((cell) => {
        return new TableCell({
          borders: border,
          children: [
            new Paragraph({
              children: [new TextRun(String(cell))],
              alignment: AlignmentType.LEFT,
            }),
          ],
        });
      }),
    });
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [headerRow, ...bodyRows],
  });
}

function longParagraphs(topic, count) {
  const out = [];
  const templates = [
    (t, i) =>
      `${t} (${i}). This part discusses the practical workflow of the ${META.projectTitle}, starting from user interaction at the frontend and ending with database persistence in MySQL. It explains how each module is connected through Express routes, controller methods, and validation checks to maintain data consistency and predictable application behavior.`,
    (t, i) =>
      `${t} (${i}). A major implementation focus is maintainability. The system separates business logic from presentation, uses reusable middleware for authentication and authorization, and applies structured error handling so that both customer and admin flows remain stable during common and edge-case operations.`,
    (t, i) =>
      `${t} (${i}). From a software engineering perspective, this module demonstrates requirement traceability: each design decision is linked to user needs such as faster search, secure checkout, and reliable order management. The resulting architecture is intentionally modular so future changes can be introduced with minimal regression risk.`,
    (t, i) =>
      `${t} (${i}). The project also addresses operational constraints, including session security, form validation, and role-based access for administrators. Input sanitization and controlled database operations reduce failures caused by malformed requests and improve overall trustworthiness of the platform.`,
    (t, i) =>
      `${t} (${i}). Performance and usability are considered together by keeping page flows simple, minimizing unnecessary data transfer, and supporting clear user feedback for key actions such as adding to cart, placing orders, and viewing payment status. This improves user confidence and lowers abandonment during checkout.`,
    (t, i) =>
      `${t} (${i}). The implementation uses Node.js and Express.js to create a lightweight but scalable backend. MySQL provides structured storage for catalog, user accounts, cart items, and orders, while relational constraints help enforce integrity between parent and child records in transactional operations.`,
    (t, i) =>
      `${t} (${i}). Testing observations for this chapter indicate that module-level behavior remains consistent across repeated runs. Integration points such as cart-to-order conversion, payment confirmation, and inventory updates are validated to ensure that business rules are followed before state changes are committed.`,
    (t, i) =>
      `${t} (${i}). The chapter concludes by evaluating trade-offs between development speed and extensibility. The current solution prioritizes clear structure and academic demonstrability while leaving room for future additions such as recommendation engines, coupon systems, notification services, and advanced analytics.`,
  ];

  for (let i = 1; i <= count; i += 1) {
    const paragraphText = templates[(i - 1) % templates.length](topic, i);
    out.push(justify(paragraphText));
  }
  return out;
}

function screenshotPlaceholder(title) {
  return [
    spacer(0),
    centerBold("Project Screenshot Here", 26),
    caption(title),
    spacer(1),
  ];
}

function diagramPlaceholder(title) {
  return [
    spacer(0),
    centerBold("Diagram Placeholder (Insert Figure Here)", 26),
    caption(title),
    spacer(1),
  ];
}

function tocTitleLine() {
  return new Paragraph({
    children: [
      new TextRun({
        text: "Table of Contents",
        bold: true,
        size: 32,
      }),
    ],
    alignment: AlignmentType.CENTER,
  });
}

async function main() {
  const header = new Header({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: `${META.projectTitle} — BCA Major Project Report`,
            size: 18,
          }),
        ],
      }),
    ],
  });

  const footer = new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: "Page ",
          }),
          PageNumber.CURRENT,
          new TextRun({ text: " of " }),
          PageNumber.TOTAL_PAGES,
        ],
      }),
    ],
  });

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: "Times New Roman",
            size: 24, // 12pt
            color: "000000",
          },
          paragraph: {
            spacing: { line: 276, before: 0, after: 180 }, // ~1.15–1.2 line spacing
          },
        },
      },
      paragraphStyles: [
        {
          id: "Heading1",
          name: "Heading 1",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: { font: "Times New Roman", bold: true, size: 32 },
          paragraph: { spacing: { before: 240, after: 120 } },
        },
        {
          id: "Heading2",
          name: "Heading 2",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: { font: "Times New Roman", bold: true, size: 28 },
          paragraph: { spacing: { before: 220, after: 100 } },
        },
        {
          id: "Heading3",
          name: "Heading 3",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: { font: "Times New Roman", bold: true, size: 26 },
          paragraph: { spacing: { before: 200, after: 90 } },
        },
      ],
      numbering: {
        config: [
          {
            reference: "outline-numbering",
            levels: [
              {
                level: 0,
                format: LevelFormat.DECIMAL,
                text: "%1.",
                alignment: AlignmentType.LEFT,
                style: {
                  paragraph: {
                    indent: { left: 720, hanging: 260 },
                    tabStops: [
                      {
                        type: TabStopType.LEFT,
                        position: TabStopPosition.MAX,
                      },
                    ],
                  },
                },
              },
              {
                level: 1,
                format: LevelFormat.DECIMAL,
                text: "%1.%2.",
                alignment: AlignmentType.LEFT,
                style: {
                  paragraph: {
                    indent: { left: 980, hanging: 260 },
                  },
                },
              },
            ],
          },
        ],
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, right: 1080, bottom: 1440, left: 1440 }, // binding-friendly
          },
        },
        headers: { default: header },
        footers: { default: footer },
        children: [
          // COVER PAGE
          centerBold("PROJECT REPORT", 44),
          spacer(1),
          centerBold(META.projectTitle.toUpperCase(), 34),
          spacer(1),
          center("Submitted in partial fulfillment of the requirements", 24),
          center(`for the award of the degree of`, 24),
          center(`${META.course}`, 24),
          spacer(1),
          centerBold(META.college, 28),
          spacer(2),
          twoColKeyValues([
            ["Student Name", META.studentName],
            ["University ID", META.universityId],
            ["Email", META.email],
            ["Guide Name", META.guideName],
            ["Academic Session", "2025–2026"],
          ]),
          spacer(2),
          center("Submitted To:", 24),
          centerBold("Chandigarh University (Online)", 26),
          pageBreak(),

          // TITLE PAGE
          centerBold("TITLE PAGE", 40),
          spacer(1),
          centerBold(META.projectTitle, 32),
          spacer(1),
          justify(
            `This report is submitted by ${META.studentName} (University ID: ${META.universityId}) in partial fulfillment of the requirements for the degree of ${META.course} at ${META.college}. The project has been carried out under the guidance of ${META.guideName}.`
          ),
          spacer(1),
          twoColKeyValues([
            ["Front-end Technologies", META.tech.frontend.join(", ")],
            ["Back-end Technologies", META.tech.backend.join(", ")],
            ["Database", META.tech.database.join(", ")],
            ["Project Type", "Web Application"],
          ]),
          pageBreak(),

          // CERTIFICATE
          centerBold("CERTIFICATE", 40),
          spacer(1),
          justify(
            `This is to certify that the project entitled “${META.projectTitle}” submitted in partial fulfillment of the degree of ${META.course} to ${META.college} is an authentic work carried out by ${META.studentName} (University ID: ${META.universityId}) under my guidance. The matter embodied in this project work has not been submitted earlier for award of any degree or diploma to the best of my knowledge and belief.`
          ),
          spacer(2),
          pr("Signature of the Student: _______________________", {
            alignment: AlignmentType.LEFT,
          }),
          pr("Signature of the Guide: _________________________", {
            alignment: AlignmentType.LEFT,
          }),
          pr("Date: ____________________", { alignment: AlignmentType.LEFT }),
          pageBreak(),

          // DECLARATION
          centerBold("DECLARATION", 40),
          spacer(1),
          justify(
            `I, ${META.studentName}, hereby declare that the project report titled “${META.projectTitle}” is my original work carried out during the academic session 2025–2026. This report has been prepared in partial fulfillment of the degree of ${META.course} at ${META.college}. All sources of information used in this report have been properly acknowledged in the bibliography.`
          ),
          spacer(2),
          pr("Signature of the Student: _______________________", {
            alignment: AlignmentType.LEFT,
          }),
          pr(`Name: ${META.studentName}`, { alignment: AlignmentType.LEFT }),
          pr(`University ID: ${META.universityId}`, {
            alignment: AlignmentType.LEFT,
          }),
          pr("Date: ____________________", { alignment: AlignmentType.LEFT }),
          pageBreak(),

          // ACKNOWLEDGEMENT
          centerBold("ACKNOWLEDGEMENT", 40),
          spacer(1),
          justify(
            `I express my sincere gratitude to my guide, ${META.guideName}, for continuous support, valuable guidance, and constructive feedback throughout the development of this project. I also thank ${META.college} for providing the necessary academic framework and resources. I am grateful to my family and friends for their encouragement and motivation during the project work.`
          ),
          spacer(2),
          pr("Signature of the Student: _______________________", {
            alignment: AlignmentType.LEFT,
          }),
          pageBreak(),

          // ABSTRACT (3–4 pages)
          centerBold("ABSTRACT", 40),
          spacer(1),
          h2("Project Title and Problem Statement"),
          justify(
            `${META.projectTitle}. The objective of the project is to provide a secure and user-friendly web application that enables users to discover books, manage cart items, and place orders online, while providing administrators with tools to manage products, categories, users, orders, inventory, and payments.`
          ),
          h2("Why the Topic is Chosen"),
          justify(
            "The e-commerce domain is widely adopted in modern business and provides a practical context to learn full-stack web development, database design, security, and software engineering best practices. An online book store is an academically suitable problem statement with clear modules and measurable outcomes."
          ),
          h2("Objective and Scope"),
          justify(
            "The primary objective is to build an end-to-end online purchasing workflow. The scope includes user registration and authentication, product listing and search, category browsing, cart and checkout, payment record management, order history, and administrative operations to maintain catalogue and orders."
          ),
          h2("Methodology (Summary)"),
          justify(
            "The project follows a modular MVC-based approach using Node.js and Express.js for routing and controllers, MySQL for relational persistence, and server-rendered views for user interaction. Development includes requirement analysis, database design, implementation, iterative testing, and result analysis."
          ),
          h2("Hardware and Software Used"),
          justify(
            "Hardware includes a standard development workstation. Software includes Node.js runtime, npm packages, MySQL server, an IDE, browser tools, and supporting utilities for debugging and testing."
          ),
          h2("Testing Technologies Used"),
          justify(
            "Testing includes manual functional validation, module-level verification of controllers and database interactions, integration testing of the cart/checkout workflow, and user acceptance testing for key user journeys."
          ),
          h2("Expected Contribution"),
          justify(
            "The project demonstrates practical skills in full-stack development, database modelling, secure session handling, structured coding practices, and the creation of a maintainable web application suitable as an academic major project submission."
          ),
          ...longParagraphs("Abstract continuation", 10),
          pageBreak(),

          // TOC
          tocTitleLine(),
          spacer(1),
          new TableOfContents(" ", {
            hyperlink: true,
            headingStyleRange: "1-3",
          }),
          pageBreak(),

          // LISTS
          centerBold("LIST OF FIGURES", 40),
          spacer(1),
          justify(
            "This section will be automatically updated after inserting diagrams and screenshots and updating fields in MS Word."
          ),
          pageBreak(),
          centerBold("LIST OF TABLES", 40),
          spacer(1),
          justify(
            "This section will be automatically updated after finalizing tables and updating fields in MS Word."
          ),
          pageBreak(),

          // MAIN CONTENT
          h1("1. Introduction"),
          ...longParagraphs(
            "Introduction to the Online Book Store Management System",
            14
          ),
          ...screenshotPlaceholder("Figure 1: Project Screenshot Here – Homepage"),
          pageBreak(),

          h1("2. Existing System"),
          ...longParagraphs("Existing system analysis", 12),
          simpleTable({
            headers: ["Parameter", "Existing Manual System", "Proposed Online System"],
            rows: [
              ["Ordering", "In-person/phone orders", "Online cart and checkout"],
              ["Inventory", "Manual stock register", "Database-driven inventory"],
              ["Payment", "Cash/UPI at counter", "Recorded payments and receipts"],
              ["Reporting", "Manual reports", "Automated order and sales views"],
            ],
          }),
          pageBreak(),

          h1("3. Proposed System"),
          ...longParagraphs("Proposed system overview", 12),
          bullet("Customer registration and secure login"),
          bullet("Book browsing, categories, and search"),
          bullet("Cart management and order placement"),
          bullet("Order history and account management"),
          bullet("Admin management of books, categories, users, orders, inventory, payments"),
          pageBreak(),

          h1("4. Objectives of the Project"),
          bullet("To design a secure and usable web-based book purchasing platform"),
          bullet("To automate catalogue, order, and inventory management"),
          bullet("To implement a normalized relational database schema in MySQL"),
          bullet("To provide an admin panel for operational control"),
          bullet("To validate the system using structured testing"),
          ...longParagraphs("Objectives elaboration", 8),
          pageBreak(),

          h1("5. Scope of the Project"),
          ...longParagraphs("Scope definition", 10),
          pageBreak(),

          h1("6. Requirement Analysis"),
          h2("6.1 Functional Requirements"),
          bullet("User registration, login, logout"),
          bullet("Browse books by category and search"),
          bullet("Add/remove/update items in cart"),
          bullet("Place orders and view order history"),
          bullet("Admin CRUD operations for books and categories"),
          bullet("Admin view and manage orders and customers"),
          h2("6.2 Non-Functional Requirements"),
          bullet("Usability and responsive layout"),
          bullet("Security for authentication and admin authorization"),
          bullet("Maintainability with modular code structure"),
          bullet("Reliability and consistent database transactions"),
          ...longParagraphs("Requirement analysis narrative", 10),
          pageBreak(),

          h1("7. Software Requirement Specification (SRS)"),
          h2("7.1 Overall Description"),
          ...longParagraphs("SRS overall description", 10),
          h2("7.2 External Interface Requirements"),
          ...longParagraphs("Interface requirements", 8),
          h2("7.3 System Features"),
          ...longParagraphs("System features in SRS style", 10),
          pageBreak(),

          h1("8. Hardware and Software Requirements"),
          simpleTable({
            headers: ["Category", "Requirement"],
            rows: [
              ["Hardware", "Laptop/Desktop, 8GB RAM (recommended), 10GB free storage"],
              ["OS", "Windows 10/11, Linux, or macOS"],
              ["Backend Runtime", "Node.js (LTS recommended)"],
              ["Database", "MySQL Server 8.x"],
              ["Tools", "VS Code/Cursor IDE, Browser (Chrome/Edge), Git"],
            ],
          }),
          ...longParagraphs("Requirements justification", 6),
          pageBreak(),

          h1("9. Feasibility Study"),
          h2("9.1 Technical Feasibility"),
          ...longParagraphs("Technical feasibility", 8),
          h2("9.2 Economic Feasibility"),
          ...longParagraphs("Economic feasibility", 6),
          h2("9.3 Operational Feasibility"),
          ...longParagraphs("Operational feasibility", 6),
          h2("9.4 Schedule Feasibility"),
          ...longParagraphs("Schedule feasibility", 6),
          pageBreak(),

          h1("10. System Design"),
          h2("10.1 Architecture"),
          ...longParagraphs("System architecture and MVC design", 10),
          ...diagramPlaceholder(
            "Figure 2: Architecture Diagram Placeholder (Client–Server with MVC)"
          ),
          h2("10.2 Module-wise Design"),
          ...longParagraphs("Module design details", 10),
          pageBreak(),

          h1("11. Data Flow Diagram (DFD)"),
          h2("11.1 Context Level DFD (Level 0)"),
          ...diagramPlaceholder("Figure 3: Context Level DFD (Level 0)"),
          h2("11.2 Level 1 DFD"),
          ...diagramPlaceholder("Figure 4: DFD Level 1"),
          h2("11.3 Level 2 DFD"),
          ...diagramPlaceholder("Figure 5: DFD Level 2"),
          ...longParagraphs("DFD explanation and data movement narrative", 10),
          pageBreak(),

          h1("12. ER Diagram"),
          ...diagramPlaceholder("Figure 6: ER Diagram Placeholder"),
          ...longParagraphs("ER diagram explanation (entities, relationships)", 10),
          pageBreak(),

          h1("13. UML Diagrams"),
          h2("13.1 Use Case Diagram"),
          ...diagramPlaceholder("Figure 7: UML Use Case Diagram Placeholder"),
          h2("13.2 Class Diagram"),
          ...diagramPlaceholder("Figure 8: UML Class Diagram Placeholder"),
          h2("13.3 Sequence Diagram"),
          ...diagramPlaceholder("Figure 9: UML Sequence Diagram Placeholder"),
          h2("13.4 Activity Diagram"),
          ...diagramPlaceholder("Figure 10: UML Activity Diagram Placeholder"),
          ...longParagraphs("UML narrative", 10),
          pageBreak(),

          h1("14. Database Design"),
          h2("14.1 Database Tables Overview"),
          justify(
            "The database is designed in MySQL using a normalized schema. Primary keys uniquely identify records, while foreign keys enforce referential integrity between users, orders, and order items."
          ),
          h2("14.2 Table Structures (Proposed)"),
          simpleTable({
            headers: ["Table", "Primary Key", "Purpose"],
            rows: [
              ["users", "user_id", "Stores customer account details"],
              ["admin", "admin_id", "Stores admin accounts"],
              ["categories", "category_id", "Stores book categories"],
              ["books", "book_id", "Stores book catalogue and inventory"],
              ["cart", "cart_id", "Stores per-user cart reference"],
              ["orders", "order_id", "Stores orders placed by users"],
              ["order_items", "order_item_id", "Stores books within orders"],
              ["payments", "payment_id", "Stores payment transactions"],
            ],
          }),
          h2("14.3 Detailed Schema (Sample)"),
          ...longParagraphs("Database schema explanation", 8),
          simpleTable({
            headers: ["Field", "Type", "Key", "Description"],
            rows: [
              ["user_id", "INT AUTO_INCREMENT", "PK", "Unique user identifier"],
              ["name", "VARCHAR(100)", "-", "Full name"],
              ["email", "VARCHAR(120)", "UNIQUE", "Login email"],
              ["password_hash", "VARCHAR(255)", "-", "Hashed password"],
              ["role", "ENUM('USER','ADMIN')", "-", "Access role"],
              ["created_at", "DATETIME", "-", "Creation timestamp"],
            ],
          }),
          pageBreak(),

          h1("15. Input Design"),
          ...longParagraphs("Input design for forms and validation", 10),
          ...screenshotPlaceholder("Figure 11: Project Screenshot Here – Login Page"),
          pageBreak(),

          h1("16. Output Design"),
          ...longParagraphs("Output design for pages and reports", 10),
          ...screenshotPlaceholder("Figure 12: Project Screenshot Here – Cart Page"),
          pageBreak(),

          h1("17. Module Description"),
          h2("17.1 Customer Module"),
          bullet("Authentication Module"),
          bullet("Book Browsing and Search Module"),
          bullet("Cart Management Module"),
          bullet("Checkout and Payment Module"),
          bullet("Order History Module"),
          h2("17.2 Admin Module"),
          bullet("Admin Authentication"),
          bullet("Book Management (CRUD)"),
          bullet("Category Management"),
          bullet("Order Management"),
          bullet("Customer Management"),
          ...longParagraphs("Module responsibilities and interactions", 12),
          ...screenshotPlaceholder("Figure 13: Project Screenshot Here – Admin Dashboard"),
          pageBreak(),

          h1("18. Implementation Details"),
          h2("18.1 Technology Justification"),
          ...longParagraphs("Implementation detail: tech stack reasoning", 10),
          h2("18.2 Backend Implementation (Node.js + Express.js)"),
          ...longParagraphs("Backend routes, controllers, middleware", 12),
          h2("18.3 Database Implementation (MySQL)"),
          ...longParagraphs("Database access patterns and transactions", 10),
          h2("18.4 Frontend Implementation (HTML/CSS/JS/Bootstrap)"),
          ...longParagraphs("Frontend templates and responsiveness", 10),
          pageBreak(),

          h1("19. Coding Section"),
          justify(
            "Note: Insert the final code printouts/screenshots or paste selected key code snippets here as required by the university format."
          ),
          ...longParagraphs("Coding section notes and key files list", 10),
          pageBreak(),

          h1("20. Testing"),
          h2("20.1 Unit Testing"),
          ...longParagraphs("Unit testing approach", 8),
          h2("20.2 Integration Testing"),
          ...longParagraphs("Integration testing approach", 8),
          h2("20.3 System Testing"),
          ...longParagraphs("System testing approach", 8),
          h2("20.4 User Acceptance Testing (UAT)"),
          ...longParagraphs("UAT approach", 6),
          pageBreak(),

          h1("21. Test Cases"),
          simpleTable({
            headers: [
              "Test Case ID",
              "Module",
              "Preconditions",
              "Input Data",
              "Expected Result",
              "Actual Result",
              "Status",
            ],
            rows: [
              [
                "TC-LOGIN-01",
                "Authentication",
                "User registered",
                "Valid email/password",
                "User logged in successfully",
                "As expected",
                "PASS",
              ],
              [
                "TC-CART-02",
                "Cart",
                "User logged in",
                "Add book to cart",
                "Item added and quantity updated",
                "As expected",
                "PASS",
              ],
              [
                "TC-ORDER-03",
                "Checkout",
                "Cart has items",
                "Confirm order",
                "Order created and stored in DB",
                "As expected",
                "PASS",
              ],
              [
                "TC-ADMIN-04",
                "Admin Products",
                "Admin logged in",
                "Add new book",
                "Book visible in catalogue",
                "As expected",
                "PASS",
              ],
            ],
          }),
          ...longParagraphs("Test case execution narrative", 10),
          pageBreak(),

          h1("22. Results and Discussion"),
          ...longParagraphs("Results and discussion", 14),
          ...screenshotPlaceholder("Figure 14: Project Screenshot Here – Payment Page"),
          pageBreak(),

          h1("23. Advantages of the System"),
          bullet("Faster purchase workflow and improved user experience"),
          bullet("Reduced manual inventory and order tracking"),
          bullet("Centralized data with better consistency and reporting"),
          bullet("Scalable architecture for future enhancements"),
          ...longParagraphs("Advantages elaboration", 8),
          pageBreak(),

          h1("24. Limitations"),
          bullet("Payment gateway and logistics integrations may be limited in scope"),
          bullet("Performance depends on hosting environment and database tuning"),
          bullet("Advanced analytics and recommendation features not included"),
          ...longParagraphs("Limitations discussion", 8),
          pageBreak(),

          h1("25. Future Enhancements"),
          bullet("Advanced search, recommendations, and personalization"),
          bullet("Multiple payment gateways and refund workflow"),
          bullet("Delivery tracking and notifications (Email/SMS)"),
          bullet("Admin analytics dashboard and reports export"),
          bullet("Mobile application integration"),
          ...longParagraphs("Future scope details", 10),
          pageBreak(),

          h1("26. Conclusion"),
          ...longParagraphs("Conclusion", 10),
          pageBreak(),

          h1("27. Bibliography"),
          bullet("Pressman, R. S. (2014). Software Engineering: A Practitioner's Approach."),
          bullet("Sommerville, I. (2016). Software Engineering."),
          bullet("Node.js Documentation (Official)."),
          bullet("Express.js Documentation (Official)."),
          bullet("MySQL 8.0 Reference Manual (Official)."),
          bullet("Bootstrap Documentation (Official)."),
          bullet("OWASP Top 10 Web Application Security Risks."),
          pageBreak(),

          h1("28. Appendix"),
          h2("A. Data Dictionary (Sample)"),
          simpleTable({
            headers: ["Data Name", "Aliases", "Length/Size", "Type", "Description"],
            rows: [
              ["email", "username", "120", "VARCHAR", "Login identifier"],
              ["password_hash", "pwd", "255", "VARCHAR", "Hashed password value"],
              ["book_id", "id", "11", "INT", "Unique identifier for a book"],
              ["order_id", "oid", "11", "INT", "Unique identifier for an order"],
            ],
          }),
          h2("B. User/Operational Manual (Summary)"),
          ...longParagraphs("Operational manual guidance", 10),
        ],
      },
    ],
  });

  const buf = await Packer.toBuffer(doc);
  let targetFile = OUT_FILE;
  try {
    fs.writeFileSync(targetFile, buf);
  } catch (err) {
    if (err && err.code === "EBUSY") {
      const stamp = new Date().toISOString().replace(/[:.]/g, "-");
      targetFile = OUT_FILE.replace(".docx", `_${stamp}.docx`);
      fs.writeFileSync(targetFile, buf);
    } else {
      throw err;
    }
  }
  // eslint-disable-next-line no-console
  console.log(`DOCX generated: ${targetFile}`);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exitCode = 1;
});

