const express = require("express");
const authenticate = require("../middleware/authenticate");
const { PrismaClient } = require("@prisma/client");


const prisma = new PrismaClient();
const router = express.Router();


  // Create a new document
  router.post("/", authenticate, async (req, res) => {
    const { identifier, docs_prosemirror_delta, docs_y_doc_state } = req.body;
    const doc = getYDoc(identifier, req.user.id)
    const state = Y.encodeStateAsUpdate(doc)
    const delta = doc.getText(identifier).toDelta()
    try {
      const document = await prisma.doc.create({
        data: {
          identifier,
          ownerId: req.user.id,
          docs_y_doc_state: state,
          docs_prosemirror_delta: delta,
        },
      });
  
      await prisma.permission.create({
        data: {
          docId: document.id,
          userId: req.user.id,
          canRead: true,
          canWrite: true,
        },
      });
  
      await client.hSet(`${document.id}:info`, {
        created: moment().toISOString(),
        updated: moment().toISOString(),
      });
  
      res.status(201).json(document);
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: "Error creating document"+error });
    }
  });
  
  // Get all documents for the user
  router.get("/", authenticate, async (req, res) => {
    try {
      const documents = await prisma.doc.findMany({
        where: {
          OR: [
            { ownerId: req.user.id },
            { permissions: { some: { userId: req.user.id, canRead: true } } },
          ],
        },
        select:{
          id:true,
          identifier:true,
          ownerId:true,
          updatedAt:true
        }
      });
      res.json(documents);
    } catch (error) {
      res.status(500).json({ error: "Error fetching documents" });
    }
  });
  
  // Get a specific document
  // Get a specific document and return its content
  router.get("/:id", authenticate, async (req, res) => {
  try {
    const document = await prisma.doc.findUnique({ where: { id: req.params.id },select:{
      id:true,
      identifier:true,
      ownerId:true,
    } });

    if (!document) return res.status(404).json({ error: "Document not found" });

    if (document.ownerId !== req.user.id) {
      const permission = await prisma.permission.findFirst({
        where: { docId: document.id, userId: req.user.id, canRead: true },
      });
      if (!permission) return res.status(403).json({ error: "No access" });
    }

    // Decode Y.js state (if stored as Uint8Array) and convert to Delta
    let delta = [];
    if (document.docs_y_doc_state) {
      const ydoc = new Y.Doc();
      Y.applyUpdate(ydoc, document.docs_y_doc_state);
      delta = ydoc.getText("prosemirror").toDelta(); // Convert to Quill-compatible Delta
    } else if (document.docs_prosemirror_delta) {
      delta = document.docs_prosemirror_delta;
    }
    res.json(document);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving document" });
  }
});

  
  // Update a document
  router.put("/:id", authenticate, async (req, res) => {
    const { docs_prosemirror_delta, docs_y_doc_state } = req.body;
    try {
      const document = await prisma.doc.findUnique({ where: { id: req.params.id } });
      if (!document) return res.status(404).json({ error: "Document not found" });
  
      if (document.ownerId !== req.user.id) {
        const permission = await prisma.permission.findFirst({
          where: { docId: document.id, userId: req.user.id, canWrite: true },
        });
        if (!permission) return res.status(403).json({ error: "No edit access" });
      }
  
      const updatedDocument = await prisma.doc.update({
        where: { id: document.id },
        data: { docs_prosemirror_delta, docs_y_doc_state },
      });
  
      await client.hSet(`${document.id}:info`, {
        updated: moment().toISOString(),
      });
  
      res.json(updatedDocument);
    } catch (error) {
      res.status(500).json({ error: "Error updating document" });
    }
  });

  router.post("/:id/permissions", authenticate, async (req, res) => {
    let { userId, canRead, canWrite } = req.body;
    const documentId = req.params.id;
    
    try {
      // Check if the document exists
      canRead = canRead === "true" || canRead === true;
      canWrite = canWrite === "true" || canWrite === true;
      const document = await prisma.doc.findUnique({ where: { id: documentId } });
      if (!document) return res.status(404).json({ error: "Document not found" });
  
      // Ensure the requesting user is the owner of the document
      if (document.ownerId !== req.user.id) {
        return res.status(403).json({ error: "You do not have permission to modify this document" });
      }
  
      // Check if the user already has permissions
      const existingPermission = await prisma.permission.findFirst({
        where: { docId: documentId, userId }
      });
  
      if (existingPermission) {
        // Update existing permission
        await prisma.permission.update({
          where: { id: existingPermission.id },
          data: { canRead, canWrite }
        });
      } else {
        // Create a new permission entry
        await prisma.permission.create({
          data: { docId: documentId, userId, canRead, canWrite }
        });
      }
  
      res.json({ message: "Permission granted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error granting permission" });
    }
  });

module.exports = router;
