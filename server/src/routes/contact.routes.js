const express = require('express');
const Contact = require('../models/Contact');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

router.use(requireAuth);

/**
 * @swagger
 * /contacts:
 *   get:
 *     summary: Récupérer tous mes contacts
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des contacts
 *       401:
 *         description: Non authentifié
 */
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find({ owner: req.user.id });
    res.json(contacts);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /contacts:
 *   post:
 *     summary: Créer un nouveau contact
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - phone
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               phone:
 *                 type: string
 *                 example: "+33612345678"
 *     responses:
 *       201:
 *         description: Contact créé avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 */
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;
    
    if (!firstName || !lastName || !phone) {
      return res.status(400).json({ message: 'firstName, lastName and phone required' });
    }
    
    if (phone.length < 10 || phone.length > 20) {
      return res.status(400).json({ message: 'phone must be between 10 and 20 characters' });
    }
    
    const contact = await Contact.create({
      firstName,
      lastName,
      phone,
      owner: req.user.id
    });
    
    res.status(201).json(contact);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /contacts/{id}:
 *   patch:
 *     summary: Modifier un contact
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contact modifié
 *       403:
 *         description: Pas le propriétaire
 *       404:
 *         description: Contact non trouvé
 */
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, phone } = req.body;
    
    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    if (contact.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    if (phone && (phone.length < 10 || phone.length > 20)) {
      return res.status(400).json({ message: 'phone must be between 10 and 20 characters' });
    }
    
    if (firstName) contact.firstName = firstName;
    if (lastName) contact.lastName = lastName;
    if (phone) contact.phone = phone;
    
    await contact.save();
    res.json(contact);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /contacts/{id}:
 *   delete:
 *     summary: Supprimer un contact
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Contact supprimé
 *       403:
 *         description: Pas le propriétaire
 *       404:
 *         description: Contact non trouvé
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    if (contact.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await contact.deleteOne();
    res.status(204).send();
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;