import { logger } from '@/logger';

async function main() {
  logger.info({
    body: {
      update_id: 824291533,
      message: {
        message_id: 115,
        from: {
          id: 6649278242,
          is_bot: false,
          first_name: 'Jack',
          last_name: 'Ong',
          username: 'jackkkonggg',
          language_code: 'en',
        },
        chat: {
          id: 6649278242,
          first_name: 'Jack',
          last_name: 'Ong',
          username: 'jackkkonggg',
          type: 'private',
        },
        date: 1718281592,
        text: '/start',
        entities: [
          {
            offset: 0,
            length: 6,
            type: 'bot_command',
          },
        ],
      },
    },
  });
  logger.error(new Error('testing 123'));
}

main();
