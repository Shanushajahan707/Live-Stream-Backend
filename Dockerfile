FROM node:alpine
<<<<<<< HEAD
=======

# Add ARG instructions here
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY

>>>>>>> 23f805dd0be31dc830a48a837c5d676682b308c3
WORKDIR /usr/src/app
COPY package*.json .
RUN npm install
COPY . .
<<<<<<< HEAD
=======

# Environment variables
>>>>>>> 23f805dd0be31dc830a48a837c5d676682b308c3
ENV PORT=3000
ENV FRONTEND_URL=http://localhost:4200
ENV MONGO_STR=mongodb+srv://livestreamhelperonline:EmYZWluSrmsAr7hn@live-stream.yeqrqfe.mongodb.net/Capture?retryWrites=true&w=majority&appName=LIve-stream
ENV SECRET_LOGIN=loginkeysecret
ENV SECRET_REFRESH=loginsecretrefresh
ENV SECRET_OTP=otpvalue
ENV PASSCODE=ilgzigbwolbtaxjr
ENV EMAIL=livestreamhelperonline@gmail.com
ENV CLIENT_ID=19030411926-mhr0sl935l3q1dlgqk98gdp9tjo8dnmk.apps.googleusercontent.com
ENV CLIENT_SECRET=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
<<<<<<< HEAD

ENV S3_BUCKET=channelshorts
ENV S3_REGION=ap-south-1
ENV S3_ACCESS_KEY=AKIA2UC3BPM546VALAFT
ENV S3_SECRET_ACCESS_KEY=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

CMD ["npm","start"]
=======
ENV S3_BUCKET=channelshorts
ENV S3_REGION=ap-south-1
ENV AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
ENV AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY

CMD ["npm","start"]
>>>>>>> 23f805dd0be31dc830a48a837c5d676682b308c3
