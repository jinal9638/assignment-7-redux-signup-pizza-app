# Redux Pizza App - SliceCraft

A modern, responsive, and state-driven e-commerce pizza ordering web application built with React, Redux Toolkit, React Router DOM, and Tailwind CSS.

This application provides a end-to-end food ordering experience—from customizing pizza selections to validating address/contact details and completing the order with instant state resets and smooth navigation.

# Key Features

# Dynamic Pizza Customizer: Interactive selection of sizes and crust types with real-time base price calculation.

# Centralized State Management (Redux Toolkit):

Live cart calculations (Subtotal, 5% GST & Taxes, Delivery Fee logic, Total Amount).

Dynamic user state and form state syncing.

UI state control for modals and global notification toasts.

# Form Validation: Client-side validation for address inputs and pincodes with immediate visual feedback.

# Complete Order Workflow: Confirmation via order modal, automated cart clearing (clearCart), success toasts, and instant redirection back to the Menu Page (/).

# Fully Responsive Design: Clean layout built using Tailwind CSS for desktop, tablet, and mobile views.

Tech Stack

State Management: Redux Toolkit (@reduxjs/toolkit), React Redux (react-redux)

Routing: React Router DOM v6

Styling: Tailwind CSS

Icons & UI: Heroicons / Lucide React

## Project Structure

src/
├── app/
│   ├── hooks.js                # Custom Redux hooks (useAppDispatch, useAppSelector)
│   └── store.js                # Global Redux store configuration
├── components/
│   ├── Navbar.js               # App header with live cart count badge
│   ├── OrderSummaryModal.js    # Modal popup for final order confirmation
|   ├── PizzaCustomizer.js      # Interactively configure pizza size,crust,toppings, dispatching state changes 
│   └── Toast.js                # Floating toast notification component
├── features/
│   ├── cart/
│   │   └── cartSlice.js        # Cart items, item quantities, and pricing calculations
│   ├── ui/
│   │   └── uiSlice.js          # Modal visibility and toast notification state
│   ├── pizza/
│   │   └── pizzaSlice.js       # Dynamically computing the item price before dispatching it to the cart
│   └── user/
│       └── userSlice.js        # User auth, guest order handling, form fields state
├── pages/
│   ├── CartPage.js
│   ├── CheckoutPage.js         # Address, payment choice, and order summary page
│   ├── MenuPage.js             # Dynamic pizza customization & product list
│   └── SignupPage.js           # Registration form with live field validation
├── App.css 
├── index.css
├── tailwind.config.js 
├── postcss.config.js
├── App.js 
├── App.js                      # Application routes configuration
└── index.js                    # React application entry point



# Git repository:

https://github.com/jinal9638/assignment-7-redux-signup-pizza-app.git

# Deployment

https://assignment-7-redux-signup-pizza-app-two.vercel.app/

cd redux-pizza-app


Install project dependencies:

npm install


Start the local development server:

npm start


Access the Application:
Open your browser and navigate to http://localhost:3000.

🔄 Redux State Workflow

[ Menu Page ] ──( Add to Cart )──> [ cartSlice ] ──( Updates Total )──> [ Navbar Badge ]
                                        │
                                        ▼
[ Checkout Page ] ──( Fill Form )──> [ Order Summary Modal ]
                                        │
                         ┌──────────────┴──────────────┐
                         ▼                             ▼
                 dispatch(clearCart())         navigate('/')


Item Selection: Users choose pizza parameters on the Menu Page; dispatched actions update cartSlice.

Checkout Validation: The Checkout Page validates address input against form constraints.

Modal & Confirmation: Submitting the form opens OrderSummaryModal.

Completion: Confirming the order clears the cart state, displays a success toast notification, and navigates back to the main menu (/).

