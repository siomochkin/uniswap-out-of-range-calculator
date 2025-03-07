# Uniswap V3 Out-of-Range Calculator

A simple web application to calculate the expected outcome when a Uniswap V3 position goes out of range.

## Features

- Calculate the token distribution when price moves below or above the price range
- Support for any user-defined token symbols
- Calculate estimated total value based on current price
- Display results in real-time as inputs change

## Scenarios

The calculator supports two scenarios:

1. **Price Below Range**: All token0 gets converted to token1 at the minimum price
2. **Price Above Range**: All token1 gets converted to token0 at the maximum price

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd uniswap-v3-calculator
```

2. Install dependencies
```bash
npm install
# or
yarn
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Building for Production

```bash
npm run build
# or
yarn build
```

## Docker Support

This application is containerized using Docker. You can run it using Docker or Docker Compose.

### Using Docker

1. Build the Docker image:
```bash
docker build -t uniswap-v3-calculator .
```

2. Run the container:
```bash
docker run -p 8080:80 uniswap-v3-calculator
```

3. Open your browser and navigate to `http://localhost:8080`

### Using Docker Compose

1. Start the application:
```bash
docker-compose up -d
```

2. Open your browser and navigate to `http://localhost:8080`

3. Stop the application:
```bash
docker-compose down
```

## Technology Stack

- React
- TypeScript
- Vite
- Tailwind CSS

## License

MIT