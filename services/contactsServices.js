import { Contact } from "../models/Contacts.js";

export const listContacts = () => Contact.find();

export const getContactById = async (contactId) => Contact.findById(contactId);

export const removeContact = async (contactId) =>
  Contact.findByIdAndDelete(contactId);

export const addContact = async (data) => Contact.create(data);

export const updateContact = async (id, body) =>
  Contact.findByIdAndUpdate(id, body);
