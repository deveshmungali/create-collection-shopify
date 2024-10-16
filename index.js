require('dotenv').config();
const axios = require('axios');

const shopifyAPI = axios.create({
  baseURL: `https://${process.env.SHOPIFY_STORE}/admin/api/2023-10/`,
  auth: {
    username: process.env.SHOPIFY_API_KEY,
    password: process.env.SHOPIFY_API_PASSWORD,
  },
  headers: {
    'Content-Type': 'application/json',
  },
});

const collections = [
  { name: "Tops" },
  { name: "Shirts" },
  { name: "Kaftans" },
  { name: "Co-Ord Sets" },
  { name: "Bottoms" },
  { name: "Sale - discount", tag: "discount" },
  { name: "FOMO", tag: "fomo" },
  { name: "UP CYCLED", tag: "upcycled" },
];

// Helper function to generate a tag from the name if no specific tag is provided
const generateTag = (name) => {
  // If name contains a hyphen, use the part after the hyphen as the tag
  if (name.includes(" - ")) {
    return name.split(" - ")[1].toLowerCase().replace(/\s+/g, '-');
  }
  // Otherwise, use the name itself (converted to lowercase and hyphenated)
  return name.toLowerCase().replace(/\s+/g, '-');
};

// Function to create a smart collection based on a tag
const createSmartCollection = async (name, tag) => {
  try {
    const response = await shopifyAPI.post('/smart_collections.json', {
      smart_collection: {
        title: name,
        published: true,
        rules: [
          {
            column: "tag",
            relation: "equals",
            condition: tag
          }
        ]
      }
    });
    console.log(`Created smart collection: ${name} with tag: ${tag}`);
  } catch (error) {
    console.error(`Error creating smart collection: ${name}`, error.response.data.errors);
  }
};

// Function to create all collections
const createCollections = async () => {
  for (const collection of collections) {
    // Use provided tag or generate a tag based on the name
    const tag = collection.tag || generateTag(collection.name);
    await createSmartCollection(collection.name, tag);
  }
};

// Call the function to create collections
createCollections();
