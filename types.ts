
export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  password: string; // Em um app real, isso deveria ser um hash
  role: 'admin' | 'user';
  subscriptionStatus: 'trial' | 'monthly' | 'quarterly' | 'yearly';
  installationDate: string; // ISO String
  subscriptionEndDate: string; // ISO String
}

export interface Offer {
  id: string;
  name: string;
  discountPercentage: number;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  carModel: string;
  licensePlate: string;
}

export interface Service {
  id: string;
  name: string;
  price: number;
}

export interface ServiceRecord {
  id: string;
  clientId: string;
  serviceIds: string[];
  subtotal: number;
  discountAmount: number;
  totalValue: number;
  offerId?: string;
  date: string; // ISO string date
}

export type TicketStatus = 'Aberto' | 'Respondido' | 'Finalizado';

export interface TicketReply {
  author: 'admin' | 'user';
  text: string;
  createdAt: string; // ISO String
}

export interface Ticket {
  id: string;
  userId: string;
  userEmail: string;
  title: string;
  description: string;
  status: TicketStatus;
  createdAt: string; // ISO String
  replies: TicketReply[];
}

export type View = 'dashboard' | 'clients' | 'services' | 'clientDetail' | 'offers' | 'admin' | 'help';