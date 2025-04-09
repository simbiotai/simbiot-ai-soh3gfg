iimport create from 'zustand';
import { useApi } from '../services/api';

export const useTicketStore = create((set) => ({
  tickets: [],
  fetchTickets: async () => {
    const api = useApi();
    try {
      const response = await api.post('/get-tickets', {});
      set({ tickets: response.data });
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    }
  },
  replyToTicket: async (id, message) => {
    const api = useApi();
    await api.post('/reply-ticket', { id, message });
    set((state) => ({
      tickets: state.tickets.map((ticket) =>
        ticket.id === id ? { ...ticket, unread: false } : ticket
      ),
    }));
  },
  closeTicket: async (id) => {
    const api = useApi();
    await api.post('/close-ticket', { id });
    set((state) => ({
      tickets: state.tickets.map((ticket) =>
        ticket.id === id ? { ...ticket, closed: true } : ticket
      ),
    }));
  },
}));