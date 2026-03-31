// SEED SCRIPT
// This script fetches all Clash Royale cards from the official API
// and loads them into our database.
// Run it with: npx ts-node src/seed.ts (from the server folder)

import prisma from './config/database';

const API_URL = 'https://api.clashroyale.com/v1/cards';

async function seed() {
  console.log('🌱 Starting seed...');

  // Step 1: Fetch cards from the Clash Royale API
  console.log('📡 Fetching cards from Clash Royale API...');

  const response = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${process.env.CLASH_ROYALE_API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const data = await response.json() as { items: any[] };
  const cards = data.items;

  console.log(`✅ Fetched ${cards.length} cards from API`);

  // Step 2: Clear existing cards (so we can re-run the script safely)
  console.log('🗑️  Clearing existing cards from database...');
  await prisma.card.deleteMany();

  // Step 3: Insert cards into the database
  console.log('💾 Inserting cards into database...');

  for (const card of cards) {
    await prisma.card.create({
      data: {
        id: card.id,
        name: card.name,
        elixir: card.elixirCost ?? 0,
        rarity: card.rarity ?? 'Common',
        type: card.type ?? 'Troop',
        iconUrl: card.iconUrls?.medium ?? '',
      },
    });
  }

  console.log(`✅ Successfully seeded ${cards.length} cards!`);
}

seed()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });