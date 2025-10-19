const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// --- API Endpoints ---

// Check if an admin exists
app.get('/api/admin/exists', async (req, res) => {
    try {
        const adminCount = await prisma.admin.count();
        res.status(200).json({ exists: adminCount > 0 });
    } catch (error) {
        res.status(500).json({ message: 'Error checking for admin', error: error.message });
    }
});

// Admin Registration (only if no admin exists)
app.post('/api/admin/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const adminCount = await prisma.admin.count();
    
    if (adminCount > 0) {
      return res.status(400).json({ message: 'An administrator already exists.' });
    }

    const newAdmin = await prisma.admin.create({
      data: { username, password }, // In a real app, hash the password!
    });
    res.status(201).json(newAdmin);
  } catch (error) {
    res.status(500).json({ message: 'Error registering administrator', error });
  }
});

// Admin Login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    if (admin && admin.password === password) { // In a real app, compare hashed passwords!
      res.status(200).json({ message: 'Login successful', admin });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});


// Create a new Item (with reporter details)
app.post('/api/items', async (req, res) => {
    try {
        const { name, description, category, location, imageUrl, status, reporterName, reporterContact } = req.body;
        const newItem = await prisma.item.create({
            data: {
                name,
                description,
                category,
                location,
                imageUrl: imageUrl || 'https://placehold.co/600x400/e2e8f0/4a5568?text=No+Image',
                status,
                reporterName,
                reporterContact,
            }
        });
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ message: 'Error creating item', error: error.message });
    }
});

// Get all Items
app.get('/api/items', async (req, res) => {
    try {
        const items = await prisma.item.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching items', error: error.message });
    }
});

// Update an Item's status (for "I Have This!")
app.put('/api/items/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updatedItem = await prisma.item.update({
            where: { id: parseInt(id) },
            data: { status }
        });
        res.status(200).json(updatedItem);
    } catch (error) {
        res.status(500).json({ message: 'Error updating item status', error: error.message });
    }
});

// Create a Claim for a Found item (with claimer details)
app.post('/api/items/:id/claim', async (req, res) => {
    try {
        const { id } = req.params;
        const { proofOfOwnership, claimerName, claimerContact } = req.body;
        
        const newClaim = await prisma.claim.create({
            data: {
                proofOfOwnership,
                claimerName,
                claimerContact,
                itemId: parseInt(id),
            }
        });

        await prisma.item.update({
            where: { id: parseInt(id) },
            data: { status: 'Pending' }
        });

        res.status(201).json(newClaim);
    } catch (error) {
        res.status(500).json({ message: 'Error creating claim', error: error.message });
    }
});

// Approve a claim and set sender/recipient details
app.put('/api/items/:id/approve', async (req, res) => {
    try {
        const { id } = req.params;

        // Find the item to get the original reporter's name
        const item = await prisma.item.findUnique({
            where: { id: parseInt(id) }
        });
        if (!item) return res.status(404).json({ message: "Item not found" });

        // Find the latest claim for this item to get the claimer's name
        const latestClaim = await prisma.claim.findFirst({
            where: { itemId: parseInt(id) },
            orderBy: { createdAt: 'desc' }
        });
        if (!latestClaim) return res.status(404).json({ message: "No claim found for this item" });

        const updatedItem = await prisma.item.update({
            where: { id: parseInt(id) },
            data: { 
              status: 'Returned',
              senderName: item.reporterName,       // The person who found it
              recipientName: latestClaim.claimerName // The person who claimed it
            }
        });
        res.status(200).json(updatedItem);
    } catch (error) {
        res.status(500).json({ message: 'Error approving claim', error: error.message });
    }
});

