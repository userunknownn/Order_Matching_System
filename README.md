# Order Matching System

This project is an implementation of an order matching system for a cryptocurrency exchange, where users can buy and sell BTC using USD. It includes user authentication, order creation, order cancellation, and order matching with real-time updates.

### Key Features

1. **User Authentication**
   - Users log in with a **username**, and a **JWT token** is generated for authentication.
   - The token expires after **5 minutes**, automatically logging the user out.
   - Each browser tab can have a separate login without interfering with others.

2. **Order Management**
   - Users can place **buy** and **sell** orders for **BTC** with **USD**.
   - Orders are placed in queues within **RabbitMQ**, and a **consumer** processes these orders.
   - **Order Conflict Handling**: The consumer ensures there are no conflicts between orders being created and orders being canceled during the matching process. It prevents orders in cancellation from being processed during a match.

3. **Order Matching Logic**
   - The system supports **limit orders** where buy orders are matched at the specified price or better.
   - **Maker** (0.5%) and **Taker** (0.3%) fees are applied automatically during order execution.

4. **RabbitMQ & Queue Management**
   - Orders to be **created** and **canceled** are published to separate queues in **RabbitMQ**.
   - The consumer is designed to ensure that no order is matched while it is in the process of being canceled, preventing race conditions and ensuring data consistency.

5. **User Interface**
   - Displays **market statistics**, including the last price, BTC/USD volume, and the highest/lowest prices in the last 24 hours.
   - **Order Book** (bid/ask) and **Global Matches** are presented clearly.
   - A **history** of the user's completed orders is available.
   - The number of displayed items (orders and matches) is limited to **10** for better user experience. Pagination is a potential future improvement.

6. **RabbitMQ Manager**
   - Accessible for monitoring the flow of orders through the queues and viewing real-time status of order processing.

### Architecture

- **Frontend**: Built with **React**, styled with **Bootstrap** or **Bulma**.
- **Backend**: Developed using **Node.js (TypeScript)**, with **Prisma** ORM for **MySQL**.
- **Queue Management**: **RabbitMQ** is used to manage order queues.
- **WebSocket**: For real-time updates and communication between the backend and frontend.

### How to Run

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/order-matching-system.git
   cd order-matching-system


#### Start the services using Docker Compose:

    docker-compose up --build

    The application will be available at:

        Frontend: http://localhost:3010

        Backend: http://localhost:3000

        RabbitMQ Manager: http://localhost:15672

    Access RabbitMQ Manager with the credentials:

        Username: YOUR_USERNAME

        Password: YOUR_PASSWORD

### Improvements and Future Work

    Pagination: Add pagination for order history and global matches to handle large datasets.

    Refinement of Consumer Logic: Explore further optimizations in the consumer to handle higher volumes of orders.


