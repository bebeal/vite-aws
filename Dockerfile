FROM public.ecr.aws/lambda/nodejs:20

# Copy function code and dependencies
COPY dist/server ${LAMBDA_TASK_ROOT}

# Set the handler
CMD [ "server.handler" ]
