# Lottery

## Prerequisites
- docker
- docker-compose

## Start Application
```
docker compose up
```

Open browser and check `localhost:8080`

## Local Setup
### Prerequisites
- mongo:latest
- node:18

### Setup Environment Variables
Open `.env` and Modify
```
MG_URI=mongodb://root:secret@127.0.0.1:27017
MG_DBNAME=lottery
X_SECOND=15
PORT=8080
```

### Build Application
```
npm install
npm run build
```

### Start Application
```
npm run start
```

### Development
```
npm run dev
```