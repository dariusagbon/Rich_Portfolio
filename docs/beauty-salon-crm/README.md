# Beauty Salon CRM: Rationale and Use Case Diagram

![Use case diagram of the Beauty Salon CRM](use-case-diagram.png)

Files in this folder:

- `use-case-diagram.svg` / `use-case-diagram.png`: the diagram, stacked-box layout (vector and image versions).
- `use-case-diagram-ellipse.svg` / `use-case-diagram-ellipse.png`: the same diagram with classic oval use cases.
- `use-case-diagram.puml`: PlantUML source, so the diagram can be edited and regenerated.

---

## 1. Rationale

### 1.1 Background of the problem

Many beauty salons still run day to day on paper logbooks, chat messages and spreadsheets. Appointments, customer
inquiries, payments and staff schedules are tracked in different places, so:

- customer history (services availed, preferences, visit frequency, complaints) gets lost or is hard to look up;
- sales figures are tallied by hand at the end of the day or month, which is slow and error-prone;
- owners can't tell which customers have stopped coming back, so they have no basis for retention offers;
- feedback from customers is collected informally and rarely acted on;
- staff accounts, roles and access are not controlled, so anyone can see or change sensitive records.

### 1.2 Proposed solution

The **Beauty Salon CRM** is a Customer Relationship Management system built in **C# on .NET** that puts customers,
staff, sales and feedback in one database. It is designed as a multi-branch / multi-tenant product: a platform owner
(Super Admin) sells **subscriptions** to salon businesses, and each salon is run by its own Admin, Manager and Staff.

C# / .NET was chosen because:

- it is strongly typed and object-oriented, which maps cleanly to the domain (Customer, Staff, Service, Payment,
  Subscription, Feedback, SalesReport);
- **Entity Framework Core** with **SQL Server** gives a reliable relational store for transactions and reports;
- **ASP.NET Core Identity** provides built-in authentication and **role-based access control**, which is exactly
  what the four actor levels need;
- the same back end can serve a desktop front end (WinForms / WPF) at the counter and a web dashboard for owners.

### 1.3 Objectives

1. Keep one complete record of every customer and their transactions.
2. Speed up front-desk work: inquiries, customer handling and payments.
3. Produce accurate sales reports for management decisions.
4. Use collected customer data and feedback to plan retention strategies.
5. Restrict each user to only the functions their role needs.
6. Let the platform owner manage salon subscriptions and admin accounts centrally.

### 1.4 Scope

**In scope:** account and subscription management, staff management, customer inquiries, customer service handling,
payment processing with receipts, sales reporting, feedback review, customer data collection and retention planning.

**Out of scope (for this version):** payroll, inventory/supplier purchasing, and online customer self-booking. The
customer is not a direct system user in this version: Staff record everything on the customer's behalf, which is why
the customer is not drawn as an actor.

### 1.5 Significance

- **Salon owners (Admin):** get reliable reports and customer data to decide on promos and loyalty programs.
- **Managers:** supervise staff and see customer feedback in one place.
- **Staff:** spend less time on paperwork and more on serving customers.
- **Customers:** get faster service, accurate billing and more personalized treatment.
- **Platform owner (Super Admin):** can onboard and bill many salons from one system.

---

## 2. Actors

The actors form a hierarchy of responsibility, from the platform level down to the front desk.

| Actor | Who they are | Why they are a separate actor |
|---|---|---|
| **Super Admin** | Owner/operator of the CRM platform | Works above any single salon; controls who can use the system and on which plan. |
| **Admin** | Salon owner or business administrator | Makes strategic decisions (sales review, retention, data) for their salon. |
| **Manager** | Branch or shift manager | Runs daily operations: supervises staff, prepares reports, handles feedback. |
| **Staff** | Front desk / receptionist / stylist | Deals with customers directly: inquiries, service and payments. |

---

## 3. Use case descriptions

### Super Admin

| Use case | Description |
|---|---|
| **Manage Admin Accounts** | Create, update, deactivate and reset passwords of salon Admin accounts. |
| **Manage Subscriptions** | Assign, renew, upgrade or cancel each salon's subscription plan and monitor its status (active, expired, unpaid). |

### Admin

| Use case | Description |
|---|---|
| **Review Sales Reports** | View the sales reports prepared by Managers: revenue per day/month, per service and per staff member. |
| **Plan Retention** | Identify inactive or at-risk customers and create retention actions such as loyalty points, discounts and follow-up promos. |
| **Data Collection** | Gather and maintain customer information (profile, visit history, preferences, spending) used for analysis. |
| **Manage Staff** | Add, edit and deactivate staff and manager accounts and set their roles. |

### Manager

| Use case | Description |
|---|---|
| **Manage Staff** | Shared with Admin: maintain staff records, schedules and assignments at the branch level. |
| **Make Sales Report** | Compile transactions into daily, weekly or monthly sales reports and submit them for the Admin's review. |
| **Review Feedback** | Read customer ratings and comments, flag complaints and follow up with the staff involved. |

### Staff

| Use case | Description |
|---|---|
| **Manage Inquiries** | Record and answer customer questions about services, prices and availability, and log them in the customer's record. |
| **Entertain Customers** | Register walk-in or returning customers, check their history and assign them to a service and stylist. |
| **Process Payments** | Compute the bill (services, discounts, loyalty points) and accept cash, card or e-wallet payment. |

---

## 4. Relationships in the diagram

- **Associations (solid lines)** link each actor to the use cases they are allowed to perform. These double as the
  role permissions to configure in ASP.NET Core Identity.
- **Manage Staff is shared by Admin and Manager.** The Admin manages staff across the business, while the Manager
  handles it day to day at the branch. Drawing one use case with two actors avoids duplicating the same function.
- **Plan Retention «include» Data Collection.** A retention plan can't be made without customer data, so every time
  retention is planned, the collected data is pulled in. Admin can also run Data Collection on its own.
- **Process Payments «include» Generate Receipt.** Every completed payment always produces a receipt, so receipt
  generation is a mandatory part of the payment flow, not an optional extension.
- **Make Sales Report (Manager) feeds Review Sales Reports (Admin).** These are kept as separate use cases because
  they are done by different actors with different permissions: the Manager prepares, the Admin reviews.
- **Feedback and payment data flow upward.** What Staff record (inquiries, payments) becomes the input for the
  Manager's reports and feedback review, which in turn feed the Admin's retention planning. Each level depends on the
  level below it, which is why the system serves all four roles from one shared database.
