import { lazy } from "react";
import { Outlet } from "react-router-dom";
// CUSTOM COMPONENTS
import Loadable from "./Loadable";
import { AuthGuard, CustomRoleBasedGuard } from "components/auth";
import DashboardLayout from "layouts/dashboard/DashboardLayout";

// ALL DASHBOARD PAGES
//const CRM = Loadable(lazy(() => import("pages/dashboard/crm")));
//const Finance = Loadable(lazy(() => import("pages/dashboard/finance")));
//const Analytics = Loadable(lazy(() => import("pages/dashboard/analytics")));
const FinanceV2 = Loadable(lazy(() => import("pages/dashboard/finance-2")));
const OffersHistory = Loadable(lazy(() => import("pages/dashboard/offers-history/offers-history")));
const AddNewOffer = Loadable(lazy(() => import("pages/dashboard/offers/add-new-offer")));
//const Ecommerce = Loadable(lazy(() => import("pages/dashboard/ecommerce")));
//const Logistics = Loadable(lazy(() => import("pages/dashboard/logistics")));
//const Marketing = Loadable(lazy(() => import("pages/dashboard/marketing")));
//const AnalyticsV2 = Loadable(lazy(() => import("pages/dashboard/analytics-2")));

// CARD PAGES
//const CreateCard = Loadable(lazy(() => import("pages/dashboard/cards/create")));
const CreateCardGroup = Loadable(lazy(() => import("pages/dashboard/cards/create-group")));
const CardGroupEdit = Loadable(lazy(() => import("pages/dashboard/cards/group-edit")));
const CardsPage = Loadable(lazy(() => import("pages/dashboard/cards/cards")));
const CardDetails = Loadable(lazy(() => import("pages/dashboard/cards/details")));

// MANAGERS PAGES
const AddNewManagerPage = Loadable(lazy(() => import("pages/dashboard/managers/add-new-manager")));
const ManagersListPage = Loadable(lazy(() => import("pages/dashboard/managers/managers-list")));
const EditManager = Loadable(lazy(() => import("pages/dashboard/managers/edit-manager")));

// USER LIST PAGES
//const AddNewUser = Loadable(lazy(() => import("pages/dashboard/users/add-new-user")));
//const UserListView = Loadable(lazy(() => import("pages/dashboard/users/user-list-1")));
//const UserGridView = Loadable(lazy(() => import("pages/dashboard/users/user-grid-1")));
//const UserListView2 = Loadable(lazy(() => import("pages/dashboard/users/user-list-2")));
//const UserGridView2 = Loadable(lazy(() => import("pages/dashboard/users/user-grid-2")));

// USER ACCOUNT PAGE
const Account = Loadable(lazy(() => import("pages/dashboard/accounts")));

// ALL INVOICE RELATED PAGES
//const InvoiceList = Loadable(lazy(() => import("pages/dashboard/invoice/list")));
//const InvoiceCreate = Loadable(lazy(() => import("pages/dashboard/invoice/create")));
//const InvoiceDetails = Loadable(lazy(() => import("pages/dashboard/invoice/details")));

// PRODUCT RELATED PAGES
//const ProductList = Loadable(lazy(() => import("pages/dashboard/products/list")));
//const ProductGrid = Loadable(lazy(() => import("pages/dashboard/products/grid")));
//const ProductCreate = Loadable(lazy(() => import("pages/dashboard/products/create")));
//const ProductDetails = Loadable(lazy(() => import("pages/dashboard/products/details")));

// E-COMMERCE RELATED PAGES
//const Cart = Loadable(lazy(() => import("pages/dashboard/ecommerce/cart")));
//const Payment = Loadable(lazy(() => import("pages/dashboard/ecommerce/payment")));
//const BillingAddress = Loadable(lazy(() => import("pages/dashboard/ecommerce/billing-address")));
//const PaymentComplete = Loadable(lazy(() => import("pages/dashboard/ecommerce/payment-complete")));

// USER PROFILE PAGE
const Profile = Loadable(lazy(() => import("pages/dashboard/profile")));

// REACT DATA TABLE PAGE
//const DataTable1 = Loadable(lazy(() => import("pages/dashboard/data-tables/table-1")));

// OTHER BUSINESS RELATED PAGES
//const Career = Loadable(lazy(() => import("pages/career/career-1")));
//const CareerApply = Loadable(lazy(() => import("pages/career/apply")));
//const About = Loadable(lazy(() => import("pages/about-us/about-us-2")));
//const FileManager = Loadable(lazy(() => import("pages/dashboard/file-manager")));

// SUPPORT RELATED PAGES
//const Support = Loadable(lazy(() => import("pages/dashboard/support/support")));
//const CreateTicket = Loadable(lazy(() => import("pages/dashboard/support/create-ticket")));

// CHAT PAGE
//const Chat = Loadable(lazy(() => import("pages/dashboard/chat")));

// USER TODO LIST PAGE
//const TodoList = Loadable(lazy(() => import("pages/dashboard/todo-list")));

// MAIL RELATED PAGES
//const Sent = Loadable(lazy(() => import("pages/dashboard/email/sent")));
//const AllMail = Loadable(lazy(() => import("pages/dashboard/email/all")));
//const Inbox = Loadable(lazy(() => import("pages/dashboard/email/inbox")));
//const Compose = Loadable(lazy(() => import("pages/dashboard/email/compose")));
//const MailDetails = Loadable(lazy(() => import("pages/dashboard/email/details")));

// ADMIN PAGES
const Commissions = Loadable(lazy(() => import("pages/dashboard/admin/commissions")));
const AddCustomCommissionPage = Loadable(lazy(() => import("pages/dashboard/admin/add-custom-commission")));
const PersonalCommissionsClients = Loadable(lazy(() => import("pages/dashboard/admin/personal-commissions-clients")));
const PersonalCommissionsTraders = Loadable(lazy(() => import("pages/dashboard/admin/personal-commissions-traders")));
const AddPersonalCommissionPage = Loadable(lazy(() => import("pages/dashboard/admin/add-personal-commission")));
const ClientsPage = Loadable(lazy(() => import("pages/dashboard/admin/clients")));
const TradersPage = Loadable(lazy(() => import("pages/dashboard/admin/traders")));
const AddNewUser = Loadable(lazy(() => import("pages/dashboard/admin/add-new-user")));
const EditUser = Loadable(lazy(() => import("pages/dashboard/admin/edit-user")));
const AdminOffersBuyPage = Loadable(lazy(() => import("pages/dashboard/admin/admin-offers-buy-list")));
const AdminOffersSellPage = Loadable(lazy(() => import("pages/dashboard/admin/admin-offers-sell-list")));
const VerificationOffersBuyPage = Loadable(lazy(() => import("pages/dashboard/admin/verification-offers-buy-list")));
const VerificationOffersSellPage = Loadable(lazy(() => import("pages/dashboard/admin/verification-offers-sell-list")));

export const DashboardRoutes = [{
  path: "dashboard",
  element: <AuthGuard>
        <DashboardLayout>
          <Outlet />
        </DashboardLayout>
      </AuthGuard>,
  children: [{
  //  index: true,
  //  element: <Analytics />
  //}, {
  //  path: "crm",
  //  element: <CRM />
  //}, {
  //  path: "finance",
  //  element: <Finance />
  //}, {
    index: true,
    element: <FinanceV2 />
  }, {
    path: "offers-history",
    element: <OffersHistory />
  }, {
    path: "managers",
    children: [{
        path: "add",
        element: <CustomRoleBasedGuard roles={["Client"]}><AddNewManagerPage /></CustomRoleBasedGuard>
    }, {
        path: "edit",
        element: <CustomRoleBasedGuard roles={["Client"]}><EditManager /></CustomRoleBasedGuard>
    }, {
        path: "list",
        element: <CustomRoleBasedGuard roles={["Client"]}><ManagersListPage /></CustomRoleBasedGuard>
    }]
  }, {
    path: "cards",
    element: <CustomRoleBasedGuard roles={["Trader"]}><CardsPage /></CustomRoleBasedGuard>
  }, {
  //  path: "create-card",
  //  element: <CustomRoleBasedGuard roles={["Trader"]}><CreateCard /></CustomRoleBasedGuard>
  //}, {
    path: "cards/create-group",
    element: <CustomRoleBasedGuard roles={["Trader"]}><CreateCardGroup /></CustomRoleBasedGuard>
  }, {
    path: "cards/group-edit",
    element: <CustomRoleBasedGuard roles={["Trader"]}><CardGroupEdit /></CustomRoleBasedGuard>
  }, {
    path: "card-details",
    element: <CustomRoleBasedGuard roles={["Trader"]}><CardDetails /></CustomRoleBasedGuard>
  }, {
    path: "add-offer",
    element: <CustomRoleBasedGuard roles={["Client", "Manager"]}><AddNewOffer /></CustomRoleBasedGuard>
  }, {
  //  path: "ecommerce",
  //  element: <Ecommerce />
  //}, {
  //  path: "logistics",
  //  element: <Logistics />
  //}, {
  //  path: "marketing",
  //  element: <Marketing />
  //}, {
  //  path: "analytics-2",
  //  element: <AnalyticsV2 />
  //}, {
  //  path: "add-user",
  //  element: <AddNewUser />
  //}, {
  //  path: "user-list",
  //  element: <UserListView />
  //}, {
  //  path: "user-grid",
  //  element: <UserGridView />
  //}, {
  //  path: "user-list-2",
  //  element: <UserListView2 />
  //}, {
  //  path: "user-grid-2",
  //  element: <UserGridView2 />
  //}, {
    path: "account",
    element: <CustomRoleBasedGuard roles={["Owner", "Trader", "Client"]}><Account /></CustomRoleBasedGuard>
  }, {
  //  path: "invoice-list",
  //  element: <InvoiceList />
  //}, {
  //  path: "create-invoice",
  //  element: <InvoiceCreate />
  //}, {
  //  path: "invoice-details",
  //  element: <InvoiceDetails />
  //}, {
  //  path: "product-list",
  //  element: <ProductList />
  //}, {
  //  path: "product-grid",
  //  element: <ProductGrid />
  //}, {
  //  path: "create-product",
  //  element: <ProductCreate />
  //}, {
  //  path: "product-details",
  //  element: <ProductDetails />
  //}, {
  //  path: "cart",
  //  element: <Cart />
  //}, {
  //  path: "payment",
  //  element: <Payment />
  //}, {
  //  path: "billing-address",
  //  element: <BillingAddress />
  //}, {
  //  path: "payment-complete",
  //  element: <PaymentComplete />
  //}, {
    path: "profile",
    element: <CustomRoleBasedGuard roles={["Owner", "Trader", "Client"]}><Profile /></CustomRoleBasedGuard>
  //}, {
  //  path: "data-table-1",
  //  element: <DataTable1 />
  //}, {
  //  path: "about",
  //  element: <About />
  //}, {
  //  path: "career",
  //  element: <Career />
  //}, {
  //  path: "career-apply",
  //  element: <CareerApply />
  //}, {
  //  path: "file-manager",
  //  element: <FileManager />
  //}, {
  //  path: "support",
  //  element: <Support />
  //}, {
  //  path: "create-ticket",
  //  element: <CreateTicket />
  //}, {
  //  path: "chat",
  //  element: <Chat />
  //}, {
  //  path: "todo-list",
  //  element: <TodoList />
  //}, {
  //  path: "mail",
  //  children: [{
  //    path: "all",
  //    element: <AllMail />
  //  }, {
  //    path: "inbox",
  //    element: <Inbox />
  //  }, {
  //    path: "sent",
  //    element: <Sent />
  //  }, {
  //    path: "compose",
  //    element: <Compose />
  //  }, {
  //    path: "details",
  //    element: <MailDetails />
  //  }]
  }, {
    path: "admin/commissions",
    element: <CustomRoleBasedGuard roles={["Owner"]}><Commissions /></CustomRoleBasedGuard>
  }, {
    path: "admin/add-custom-commission",
    element: <CustomRoleBasedGuard roles={["Owner"]}><AddCustomCommissionPage /></CustomRoleBasedGuard>
  }, {
    path: "admin/personal-commissions-clients",
    element: <CustomRoleBasedGuard roles={["Owner"]}><PersonalCommissionsClients /></CustomRoleBasedGuard>
  }, {
    path: "admin/personal-commissions-traders",
    element: <CustomRoleBasedGuard roles={["Owner"]}><PersonalCommissionsTraders /></CustomRoleBasedGuard>
  }, {
    path: "admin/add-personal-commission",
    element: <AddPersonalCommissionPage roles={["Owner"]}/>
  }, {
    path: "admin/clients",
    element: <CustomRoleBasedGuard roles={["Owner"]}><ClientsPage /></CustomRoleBasedGuard>
  }, {
    path: "admin/traders",
    element: <CustomRoleBasedGuard roles={["Owner"]}><TradersPage /></CustomRoleBasedGuard>
  }, {
    path: "admin/add-user",
    element: <CustomRoleBasedGuard roles={["Owner"]}><AddNewUser /></CustomRoleBasedGuard>
  }, {
    path: "admin/edit-user",
    element: <CustomRoleBasedGuard roles={["Owner"]}><EditUser /></CustomRoleBasedGuard>
  }, {
    path: "admin/buy-offers-list",
    element: <CustomRoleBasedGuard roles={["Owner"]}><AdminOffersBuyPage /></CustomRoleBasedGuard>
  }, {
    path: "admin/sell-offers-list",
    element: <CustomRoleBasedGuard roles={["Owner"]}><AdminOffersSellPage /></CustomRoleBasedGuard>
  }, {
    path: "admin/verification-buy-offers-list",
    element: <CustomRoleBasedGuard roles={["Owner"]}><VerificationOffersBuyPage /></CustomRoleBasedGuard>
  }, {
    path: "admin/verification-sell-offers-list",
    element: <CustomRoleBasedGuard roles={["Owner"]}><VerificationOffersSellPage /></CustomRoleBasedGuard>
  }]
}];