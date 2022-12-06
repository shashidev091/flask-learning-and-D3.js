FROM python:3.11
EXPOSE 8001
WORKDIR /app
COPY . .
RUN pip install -r requirements.txt
CMD ["flask", "run", "--host", "0.0.0.0", "-p", "8001"]