const { app } = require('@azure/functions');
const { TableClient } = require('@azure/data-tables');

// Define the Azure Table Storage details
const connectionString = process.env.STORAGE_CONNECTION_STRING;
const tableName = 'VisitorCounter';

// HTTP trigger for the visitor counter
app.http('visitorCounter', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`VisitorCounter function triggered for URL "${request.url}"`);

        try {
            // Connect to the Azure Table Storage
            const client = TableClient.fromConnectionString(connectionString, tableName);

            // Retrieve the current visitor count
            let entity;
            try {
                entity = await client.getEntity('counter', 'totalVisits');
            } catch (error) {
                if (error.statusCode === 404) {
                    // If entity does not exist, create it with an initial count
                    entity = {
                        partitionKey: 'counter',
                        rowKey: 'totalVisits',
                        count: '0',
                    };
                    await client.createEntity(entity);
                } else {
                    throw error;
                }
            }

            // Increment the count
            let currentCount = parseInt(entity.count, 10) || 0;
            currentCount += 1;

            // Update the entity in the table
            entity.count = currentCount.toString();
            await client.updateEntity(entity, 'Replace');

            // Return the updated count
            return {
                status: 200,
                body: `Visitor count: ${currentCount}`,
            };
        } catch (error) {
            context.log.error('Error processing visitor counter:', error);
            return {
                status: 500,
                body: 'An error occurred while processing the request.',
            };
        }
    },
});