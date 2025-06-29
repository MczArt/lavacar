
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import type { Client, Service, ServiceRecord, View, Offer, User, Ticket, TicketStatus, TicketReply } from './types';
import { useData } from './hooks/useData';
import { useAuth } from './hooks/useAuth';
import { useLocalStorage } from './hooks/useLocalStorage';
import { CarWashIcon, UsersIcon, WrenchScrewdriverIcon, PlusCircleIcon, WhatsAppIcon, ArrowLeftIcon, ChartBarIcon, TagIcon, CogIcon, LogoutIcon, LockClosedIcon, QuestionMarkCircleIcon, CurrencyDollarIcon, UserGroupIcon, ChatBubbleLeftRightIcon, RocketLaunchIcon, DownloadIcon } from './components/Icons';
import Modal from './components/Modal';

const TRIAL_PERIOD_DAYS = 5;

// --- Reusable UI Components ---
const Input = (props: React.ComponentPropsWithoutRef<'input'>) => (
  <input {...props} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue transition disabled:bg-gray-100" />
);
const TextArea = (props: React.ComponentPropsWithoutRef<'textarea'>) => (
  <textarea {...props} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue transition" />
);

const Button = ({ children, className = '', variant = 'primary', ...props }: React.ComponentPropsWithoutRef<'button'> & { variant?: 'primary' | 'secondary' }) => {
    const baseClasses = "px-4 py-2 rounded-md font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
    const variantClasses = variant === 'primary'
        ? "bg-brand-blue text-white hover:bg-brand-blue-dark focus:ring-brand-blue"
        : "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400";
    return (
        <button className={`${baseClasses} ${variantClasses} ${className}`} {...props}>
            {children}
        </button>
    );
};

// --- Landing Page Components ---
const LandingPage = ({ onLoginClick, onRegisterClick }: { onLoginClick: () => void, onRegisterClick: () => void }) => {
    const plans = [
        { id: 'monthly', name: 'Mensal', price: '49,90', per: 'mês', features: ['Gestão de Clientes', 'Histórico de Serviços', 'Suporte por Ticket'] },
        { id: 'quarterly', name: 'Trimestral', price: '43,30', per: 'mês', detail: 'R$129,90 por 3 meses', features: ['Tudo do plano Mensal', 'Relatórios Financeiros', 'Lembretes via WhatsApp'] },
        { id: 'yearly', name: 'Anual', price: '39,90', per: 'mês', detail: 'R$478,80 por ano', best: true, features: ['Tudo do plano Trimestral', 'Suporte Prioritário', 'Acesso antecipado a recursos'] },
    ];

    const benefits = [
        { icon: <UsersIcon className="w-8 h-8 text-brand-blue" />, title: "Gestão de Clientes", description: "Mantenha um histórico completo de seus clientes, veículos e serviços prestados." },
        { icon: <CurrencyDollarIcon className="w-8 h-8 text-brand-blue" />, title: "Controle Financeiro", description: "Acompanhe faturamento, serviços realizados e descontos aplicados com facilidade." },
        { icon: <WhatsAppIcon className="w-8 h-8 text-brand-blue" />, title: "Comunicação Eficaz", description: "Envie lembretes e ofertas personalizadas para seus clientes via WhatsApp." },
        { icon: <WrenchScrewdriverIcon className="w-8 h-8 text-brand-blue" />, title: "Histórico de Serviços", description: "Saiba exatamente quais serviços foram feitos para cada cliente e quando foi a última visita." },
        { icon: <ChartBarIcon className="w-8 h-8 text-brand-blue" />, title: "Relatórios Inteligentes", description: "Visualize o desempenho do seu negócio com relatórios claros e informativos." },
        { icon: <RocketLaunchIcon className="w-8 h-8 text-brand-blue" />, title: "Acesso de Onde Estiver", description: "Nosso sistema é 100% online. Acesse seus dados de qualquer dispositivo, a qualquer hora." },
    ];

    return (
        <div className="bg-brand-gray-light font-sans text-gray-800">
            <header className="sticky top-0 bg-white/80 backdrop-blur-lg shadow-sm z-40">
                <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
                    <a href="#inicio" className="flex items-center gap-2 cursor-pointer">
                        <CarWashIcon className="h-8 w-8 text-brand-blue" />
                        <span className="font-bold text-xl">Lava Rápido Pro</span>
                    </a>
                    <div className="hidden md:flex items-center space-x-8">
                        <a href="#inicio" className="text-gray-600 hover:text-brand-blue transition-colors font-medium">Início</a>
                        <a href="#beneficios" className="text-gray-600 hover:text-brand-blue transition-colors font-medium">Benefícios</a>
                        <a href="#planos" className="text-gray-600 hover:text-brand-blue transition-colors font-medium">Planos</a>
                    </div>
                    <Button onClick={onLoginClick}>Login</Button>
                </nav>
            </header>

            <main>
                <section id="inicio" className="pt-24 pb-20 text-center bg-white">
                    <div className="container mx-auto px-6">
                        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
                            O sistema completo para <span className="text-brand-blue">seu lava rápido</span>
                        </h1>
                        <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600">
                            Gerencie clientes, serviços e finanças de forma simples e eficiente. Aumente sua produtividade e fidelize mais clientes.
                        </p>
                        <div className="mt-10 flex justify-center gap-4">
                            <Button onClick={onRegisterClick} className="text-lg px-8 py-3">Começar teste de 5 dias</Button>
                            <a href="#demo">
                                <Button variant="secondary" className="text-lg px-8 py-3">Ver demonstração</Button>
                            </a>
                        </div>
                    </div>
                </section>
                
                <section id="demo" className="py-24 bg-brand-gray-light">
                    <div className="container mx-auto px-6">
                        <div className="text-center">
                            <h2 className="text-4xl font-bold">Gerencie seu negócio visualmente</h2>
                            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">Um painel de controle poderoso e intuitivo que centraliza todas as informações que você precisa.</p>
                        </div>
                        <div className="mt-12 bg-white p-4 sm:p-6 rounded-2xl shadow-2xl border border-gray-200 max-w-5xl mx-auto transform hover:scale-[1.02] transition-transform duration-500">
                           <div className="flex justify-between items-center mb-4 border-b pb-3">
                             <h3 className="text-xl font-bold text-gray-800">Dashboard</h3>
                             <div className="flex items-center gap-2 text-sm text-gray-500">
                               <span>Hoje: {new Date().toLocaleDateString('pt-BR')}</span>
                             </div>
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-blue-50 p-4 rounded-lg"><h4 className="text-md font-semibold text-blue-800">Total de Clientes</h4><p className="text-3xl font-bold text-blue-900">78</p></div>
                                <div className="bg-green-50 p-4 rounded-lg"><h4 className="text-md font-semibold text-green-800">Serviços Hoje</h4><p className="text-3xl font-bold text-green-900">12</p></div>
                                <div className="bg-yellow-50 p-4 rounded-lg"><h4 className="text-md font-semibold text-yellow-800">Faturamento do Dia</h4><p className="text-3xl font-bold text-yellow-900">R$ 540,00</p></div>
                            </div>
                            <div className="mt-6 flex flex-col md:flex-row gap-6">
                                <div className="flex-1 bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-bold mb-3 text-gray-700">Clientes Recentes</h4>
                                    <ul className="space-y-2">
                                        <li className="flex justify-between items-center p-2 rounded-md bg-white shadow-sm"><span>João Silva (Honda Civic)</span><span className="font-medium text-brand-blue">R$ 50,00</span></li>
                                        <li className="flex justify-between items-center p-2 rounded-md bg-white shadow-sm"><span>Maria Oliveira (Toyota Corolla)</span><span className="font-medium text-brand-blue">R$ 150,00</span></li>
                                        <li className="flex justify-between items-center p-2 rounded-md bg-white shadow-sm"><span>Carlos Pereira (Ford Ka)</span><span className="font-medium text-brand-blue">R$ 30,00</span></li>
                                    </ul>
                                </div>
                                <div className="flex-1 bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-bold mb-3 text-gray-700">Performance Semanal</h4>
                                    <div className="flex justify-around items-end h-32">
                                        <div className="w-8 bg-brand-blue-light rounded-t-md" style={{height: '60%'}} title="Seg"></div>
                                        <div className="w-8 bg-brand-blue-light rounded-t-md" style={{height: '80%'}} title="Ter"></div>
                                        <div className="w-8 bg-brand-blue rounded-t-md" style={{height: '90%'}} title="Qua"></div>
                                        <div className="w-8 bg-brand-blue-light rounded-t-md" style={{height: '75%'}} title="Qui"></div>
                                        <div className="w-8 bg-brand-blue-dark rounded-t-md" style={{height: '100%'}} title="Sex"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="beneficios" className="py-24 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="text-center">
                            <h2 className="text-4xl font-bold">Tudo que você precisa para crescer</h2>
                            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">Recursos pensados para otimizar cada etapa da gestão do seu lava rápido.</p>
                        </div>
                        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {benefits.map(benefit => (
                                <div key={benefit.title} className="text-center p-6 rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="flex justify-center items-center h-16 w-16 mx-auto bg-blue-100 rounded-full">{benefit.icon}</div>
                                    <h3 className="mt-6 text-xl font-bold">{benefit.title}</h3>
                                    <p className="mt-2 text-gray-600">{benefit.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="planos" className="py-24">
                     <div className="container mx-auto px-6">
                        <div className="text-center">
                            <h2 className="text-4xl font-bold">Planos flexíveis para o seu negócio</h2>
                            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">Comece com um teste gratuito de 5 dias. Sem cartão de crédito, sem compromisso.</p>
                        </div>
                        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                           {plans.map(plan => (
                                <div key={plan.id} className={`bg-white p-8 rounded-xl shadow-lg border-2 flex flex-col ${plan.best ? 'border-brand-blue' : 'border-transparent'}`}>
                                    {plan.best && <span className="bg-brand-blue text-white text-xs font-bold uppercase px-3 py-1 rounded-full self-center mb-4">Mais Popular</span>}
                                    <h3 className="text-2xl font-bold text-center">{plan.name}</h3>
                                    <div className="mt-4 text-center">
                                        <span className="text-5xl font-extrabold">R${plan.price}</span>
                                        <span className="text-lg text-gray-500">/{plan.per}</span>
                                    </div>
                                    {plan.detail && <p className="text-center text-sm text-gray-500 mt-1">({plan.detail})</p>}
                                    <ul className="mt-8 space-y-3 text-gray-600 flex-grow">
                                        {plan.features.map(feature => (
                                            <li key={feature} className="flex items-center gap-3">
                                                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <Button onClick={onRegisterClick} className="w-full mt-8 text-lg" variant={plan.best ? 'primary' : 'secondary'}>
                                        Começar agora
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-gray-800 text-white py-12">
                <div className="container mx-auto px-6 text-center">
                    <p>&copy; {new Date().getFullYear()} Lava Rápido Pro. Todos os direitos reservados.</p>
                </div>
            </footer>
        </div>
    );
};


// --- Form Components ---
const ClientForm = ({ onSave, onCancel }: { onSave: (client: Omit<Client, 'id'>) => void, onCancel: () => void }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [carModel, setCarModel] = useState('');
    const [licensePlate, setLicensePlate] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ name, phone, carModel, licensePlate });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input type="text" placeholder="Nome" value={name} onChange={e => setName(e.target.value)} required />
            <Input type="tel" placeholder="WhatsApp (ex: 5511999998888)" value={phone} onChange={e => setPhone(e.target.value)} required />
            <Input type="text" placeholder="Modelo do Carro" value={carModel} onChange={e => setCarModel(e.target.value)} required />
            <Input type="text" placeholder="Placa" value={licensePlate} onChange={e => setLicensePlate(e.target.value)} required />
            <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
                <Button type="submit">Salvar Cliente</Button>
            </div>
        </form>
    );
};

const ServiceForm = ({ onSave, onCancel }: { onSave: (service: Omit<Service, 'id'>) => void, onCancel: () => void }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ name, price: parseFloat(price) });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input type="text" placeholder="Nome do Serviço" value={name} onChange={e => setName(e.target.value)} required />
            <Input type="number" step="0.01" placeholder="Preço (R$)" value={price} onChange={e => setPrice(e.target.value)} required />
            <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
                <Button type="submit">Salvar Serviço</Button>
            </div>
        </form>
    );
};

const OfferForm = ({ onSave, onCancel }: { onSave: (offer: Omit<Offer, 'id'>) => void, onCancel: () => void }) => {
    const [name, setName] = useState('');
    const [discount, setDiscount] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ name, discountPercentage: parseFloat(discount) });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input type="text" placeholder="Nome da Oferta (ex: 10% OFF)" value={name} onChange={e => setName(e.target.value)} required />
            <Input type="number" step="1" placeholder="Porcentagem de Desconto (%)" value={discount} onChange={e => setDiscount(e.target.value)} required />
            <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
                <Button type="submit">Salvar Oferta</Button>
            </div>
        </form>
    );
};

const ServiceRecordForm = ({ client, services, offers, onSave, onCancel }: { client: Client, services: Service[], offers: Offer[], onSave: (record: Omit<ServiceRecord, 'id'>) => void, onCancel: () => void }) => {
    const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
    const [selectedOfferId, setSelectedOfferId] = useState<string>('');

    const handleServiceToggle = (serviceId: string) => {
        setSelectedServiceIds(prev =>
            prev.includes(serviceId) ? prev.filter(id => id !== serviceId) : [...prev, serviceId]
        );
    };

    const { subtotal, discountAmount, totalValue } = useMemo(() => {
        const sub = selectedServiceIds.reduce((total, id) => {
            const service = services.find(s => s.id === id);
            return total + (service?.price || 0);
        }, 0);

        const offer = offers.find(o => o.id === selectedOfferId);
        const discountPerc = offer ? offer.discountPercentage : 0;
        const discount = (sub * discountPerc) / 100;
        const total = sub - discount;

        return { subtotal: sub, discountAmount: discount, totalValue: total };
    }, [selectedServiceIds, services, selectedOfferId, offers]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedServiceIds.length === 0) {
            alert("Selecione ao menos um serviço.");
            return;
        }
        onSave({
            clientId: client.id,
            serviceIds: selectedServiceIds,
            offerId: selectedOfferId || undefined,
            subtotal,
            discountAmount,
            totalValue,
            date: new Date().toISOString(),
        });
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <h3 className="text-lg font-medium text-gray-800">Selecione os Serviços</h3>
                <div className="mt-2 space-y-2 max-h-40 overflow-y-auto p-2 border rounded-md">
                    {services.map(service => (
                        <label key={service.id} htmlFor={`service-${service.id}`} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 cursor-pointer">
                            <div>
                                <span className="font-medium text-gray-700">{service.name}</span>
                                <span className="text-gray-500 ml-2">{service.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                            </div>
                            <input id={`service-${service.id}`} type="checkbox" checked={selectedServiceIds.includes(service.id)} onChange={() => handleServiceToggle(service.id)} className="h-5 w-5 rounded border-gray-300 text-brand-blue focus:ring-brand-blue"/>
                        </label>
                    ))}
                </div>
            </div>

            <div>
                 <label htmlFor="offer-select" className="block text-sm font-medium text-gray-700">Aplicar Oferta (Opcional)</label>
                 <select id="offer-select" value={selectedOfferId} onChange={e => setSelectedOfferId(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm rounded-md">
                     <option value="">Nenhuma oferta</option>
                     {offers.map(offer => (
                         <option key={offer.id} value={offer.id}>{offer.name} ({offer.discountPercentage}%)</option>
                     ))}
                 </select>
            </div>

            <div className="space-y-1 text-right text-gray-800 pt-2">
                <p>Subtotal: <span className="font-medium">{subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span></p>
                <p className="text-red-600">Desconto: <span className="font-medium">-{discountAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span></p>
                <p className="text-xl font-bold">Total: <span className="text-brand-blue">{totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span></p>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
                <Button type="submit">Registrar Serviço</Button>
            </div>
        </form>
    );
};

// --- Page/View Components ---
const Dashboard = ({ data }: { data: ReturnType<typeof useData> }) => {
    const { daily, weekly, monthly } = useMemo(() => {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        const startOfWeek = new Date(startOfToday);
        startOfWeek.setDate(startOfWeek.getDate() - startOfToday.getDay()); // Sunday as start of week (day 0)
        
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        let dailyRevenue = 0;
        let weeklyRevenue = 0;
        let monthlyRevenue = 0;

        for (const record of data.records) {
            const recordDate = new Date(record.date);

            if (recordDate >= startOfToday) {
                dailyRevenue += record.totalValue;
            }
            if (recordDate >= startOfWeek) {
                weeklyRevenue += record.totalValue;
            }
            if (recordDate >= startOfMonth) {
                monthlyRevenue += record.totalValue;
            }
        }
        
        return { daily: dailyRevenue, weekly: weeklyRevenue, monthly: monthlyRevenue };

    }, [data.records]);

    const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const handleExport = () => {
        const header = '"Métrica","Valor"\n';
        const rows = [
            `"Faturamento do Dia","${formatCurrency(daily)}"`,
            `"Faturamento Semanal","${formatCurrency(weekly)}"`,
            `"Faturamento Mensal","${formatCurrency(monthly)}"`
        ].join('\n');

        const csvContent = "data:text/csv;charset=utf-8," + header + rows;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "relatorio_faturamento.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const StatCard = ({ title, value }: { title: string, value: string }) => (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-600">{title}</h2>
            <p className="text-4xl font-bold text-brand-blue mt-2">{value}</p>
        </div>
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                <Button onClick={handleExport} variant="secondary">
                    <DownloadIcon className="h-5 w-5" />
                    Exportar Relatório
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Faturamento do Dia" value={formatCurrency(daily)} />
                <StatCard title="Faturamento Semanal" value={formatCurrency(weekly)} />
                <StatCard title="Faturamento Mensal" value={formatCurrency(monthly)} />
            </div>
        </div>
    );
}

const ClientsPage = ({ data, onSelectClient, onAddClient }: { data: ReturnType<typeof useData>, onSelectClient: (id: string) => void, onAddClient: () => void }) => {
    const [filter, setFilter] = useState('all');

    const filteredClients = useMemo(() => {
        if (filter === 'all') {
            return data.clients;
        }
        const days = parseInt(filter);
        const now = new Date();

        return data.clients.filter(client => {
            const clientRecords = data.records
                .filter(r => r.clientId === client.id)
                .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            
            if (clientRecords.length === 0) {
                return true; 
            }
            
            const lastRecordDate = new Date(clientRecords[0].date);
            const daysSinceLastService = (now.getTime() - lastRecordDate.getTime()) / (1000 * 3600 * 24);
            
            return daysSinceLastService > days;
        });
    }, [data.clients, data.records, filter]);

    return (
        <div>
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <h1 className="text-3xl font-bold text-gray-800">Clientes</h1>
                <div className="flex items-center gap-4">
                    <select value={filter} onChange={e => setFilter(e.target.value)} className="rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue">
                        <option value="all">Todos os clientes</option>
                        <option value="30">Sem serviço há +30 dias</option>
                        <option value="60">Sem serviço há +60 dias</option>
                        <option value="90">Sem serviço há +90 dias</option>
                    </select>
                    <Button onClick={onAddClient}><PlusCircleIcon className="h-5 w-5" />Novo Cliente</Button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClients.length === 0 && <p className="text-gray-500 col-span-full">Nenhum cliente encontrado com o filtro selecionado.</p>}
                {filteredClients.map(client => (<div key={client.id} onClick={() => onSelectClient(client.id)} className="bg-white p-5 rounded-lg shadow hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer"><h3 className="text-xl font-bold text-gray-800">{client.name}</h3><p className="text-gray-600">{client.carModel} - {client.licensePlate}</p><p className="text-brand-blue-dark font-medium mt-2">{client.phone}</p></div>))}
            </div>
        </div>
    );
};

const ServicesPage = ({ data, onAddService }: { data: ReturnType<typeof useData>, onAddService: () => void }) => (
    <div>
        <div className="flex justify-between items-center mb-6"><h1 className="text-3xl font-bold text-gray-800">Serviços</h1><Button onClick={onAddService}><PlusCircleIcon className="h-5 w-5" />Novo Serviço</Button></div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <ul className="divide-y divide-gray-200">
                {data.services.length === 0 && <li className="p-4 text-gray-500">Nenhum serviço cadastrado.</li>}
                {data.services.map(service => (<li key={service.id} className="p-4 flex justify-between items-center"><span className="text-lg font-medium text-gray-800">{service.name}</span><span className="text-lg font-bold text-brand-blue">{service.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span></li>))}
            </ul>
        </div>
    </div>
);

const OffersPage = ({ data, onAddOffer }: { data: ReturnType<typeof useData>, onAddOffer: () => void }) => (
    <div>
        <div className="flex justify-between items-center mb-6"><h1 className="text-3xl font-bold text-gray-800">Ofertas de Desconto</h1><Button onClick={onAddOffer}><PlusCircleIcon className="h-5 w-5" />Nova Oferta</Button></div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <ul className="divide-y divide-gray-200">
                {data.offers.length === 0 && <li className="p-4 text-gray-500">Nenhuma oferta cadastrada.</li>}
                {data.offers.map(offer => (<li key={offer.id} className="p-4 flex justify-between items-center"><span className="text-lg font-medium text-gray-800">{offer.name}</span><span className="text-lg font-bold text-red-600">{offer.discountPercentage}% OFF</span></li>))}
            </ul>
        </div>
    </div>
);

const ClientDetailPage = ({ clientId, data, onBack, onAddRecord, onSendMessage }: { clientId: string, data: ReturnType<typeof useData>, onBack: () => void, onAddRecord: () => void, onSendMessage: () => void }) => {
    const client = useMemo(() => data.clients.find(c => c.id === clientId), [clientId, data.clients]);
    const clientRecords = useMemo(() => data.getClientRecords(clientId), [clientId, data]);
    const lastRecord = clientRecords[0];

    if (!client) return <div className="text-center text-gray-500">Cliente não encontrado. <Button onClick={onBack}>Voltar</Button></div>;

    return (
        <div>
            <Button onClick={onBack} variant="secondary" className="mb-6"><ArrowLeftIcon className="h-5 w-5" />Voltar para Clientes</Button>
            <div className="bg-white p-6 rounded-lg shadow mb-6 flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">{client.name}</h1>
                    <p className="text-gray-600">{client.carModel} - {client.licensePlate}</p>
                    <p className="text-brand-blue-dark font-medium mt-1">{client.phone}</p>
                </div>
                <Button onClick={onSendMessage} className="bg-green-500 hover:bg-green-600 focus:ring-green-500"><WhatsAppIcon className="h-5 w-5" />Enviar Mensagem</Button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4"><h2 className="text-2xl font-bold text-gray-800">Histórico de Serviços</h2><Button onClick={onAddRecord}><PlusCircleIcon className="h-5 w-5" />Registrar Serviço</Button></div>
                {lastRecord && (<p className="mb-4 text-gray-600">Última visita em: <span className="font-semibold">{new Date(lastRecord.date).toLocaleDateString('pt-BR')}</span></p>)}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {clientRecords.length === 0 && <p className="text-gray-500">Nenhum serviço registrado para este cliente.</p>}
                    {clientRecords.map(record => (<div key={record.id} className="border p-4 rounded-md"><p className="font-semibold text-gray-700">{new Date(record.date).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}</p><ul className="list-disc list-inside text-gray-600">{record.serviceIds.map(sid => (<li key={sid}>{data.services.find(s => s.id === sid)?.name || 'Serviço desconhecido'}</li>))}</ul><div className="text-right mt-2"><p className="text-sm text-gray-500">Subtotal: {record.subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>{record.discountAmount > 0 && <p className="text-sm text-red-500">Desconto: -{record.discountAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>}<p className="font-bold text-lg text-brand-blue">Total: {record.totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p></div></div>))}
                </div>
            </div>
        </div>
    );
};

// --- Ticket System Components ---
const TicketStatusBadge = ({ status }: { status: TicketStatus }) => {
    const statusClasses = {
        'Aberto': 'bg-blue-100 text-blue-800',
        'Respondido': 'bg-yellow-100 text-yellow-800',
        'Finalizado': 'bg-green-100 text-green-800',
    };
    return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses[status]}`}>{status}</span>
};

const TicketForm = ({ onSave, onCancel }: { onSave: (data: { title: string, description: string }) => void, onCancel: () => void }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ title, description });
    };
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input type="text" placeholder="Título do Ticket" value={title} onChange={e => setTitle(e.target.value)} required />
            <TextArea rows={4} placeholder="Descreva seu problema ou dúvida..." value={description} onChange={e => setDescription(e.target.value)} required />
            <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
                <Button type="submit">Enviar Ticket</Button>
            </div>
        </form>
    );
};

const HelpPage = ({ tickets, onAddTicket }: { tickets: Ticket[], onAddTicket: () => void }) => (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Ajuda & Suporte</h1>
            <Button onClick={onAddTicket}><PlusCircleIcon className="h-5 w-5" />Novo Ticket</Button>
        </div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <ul className="divide-y divide-gray-200">
                {tickets.length === 0 && <li className="p-4 text-gray-500">Nenhum ticket de suporte aberto.</li>}
                {tickets.map(ticket => (
                    <li key={ticket.id} className="p-4">
                        <div className="flex justify-between items-start">
                           <div>
                             <p className="text-lg font-bold text-gray-800">{ticket.title}</p>
                             <p className="text-sm text-gray-500 mt-1">Aberto em: {new Date(ticket.createdAt).toLocaleString('pt-BR')}</p>
                           </div>
                            <TicketStatusBadge status={ticket.status} />
                        </div>
                        <div className="mt-4 border-t pt-4 space-y-4">
                            <div className="bg-gray-50 p-3 rounded-md">
                                <p className="font-semibold text-sm text-gray-700">Você:</p>
                                <p className="text-gray-600">{ticket.description}</p>
                            </div>
                            {ticket.replies.map(reply => (
                                <div key={reply.createdAt} className={`p-3 rounded-md ${reply.author === 'admin' ? 'bg-blue-50' : 'bg-gray-50'}`}>
                                    <div className="flex justify-between items-center mb-1">
                                        <p className="font-semibold text-sm text-gray-700">{reply.author === 'admin' ? 'Suporte' : 'Você'}</p>
                                        <p className="text-xs text-gray-400">{new Date(reply.createdAt).toLocaleString('pt-BR')}</p>
                                    </div>
                                    <p className="text-gray-600 whitespace-pre-wrap">{reply.text}</p>
                                </div>
                            ))}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    </div>
);


// --- Admin Portal Components ---
const AdminDashboard = ({ users }: { users: User[] }) => {
    const totalUsers = useMemo(() => users.filter(u => u.role === 'user').length, [users]);
    const monthlyRevenue = useMemo(() => {
        const PLAN_PRICES = { monthly: 49.90, quarterly: 129.90 / 3, yearly: 29.90 };
        return users
            .filter(u => u.role === 'user' && u.subscriptionStatus !== 'trial')
            .reduce((total, user) => total + (PLAN_PRICES[user.subscriptionStatus] || 0), 0);
    }, [users]);
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

    const handleSendMessage = () => {
        alert("Mensagens promocionais enviadas para todos os usuários! (Simulação)");
        setIsMessageModalOpen(false);
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow"><h2 className="text-lg font-semibold text-gray-600">Total de Usuários</h2><p className="text-4xl font-bold text-brand-blue">{totalUsers}</p></div>
                <div className="bg-white p-6 rounded-lg shadow"><h2 className="text-lg font-semibold text-gray-600">Faturamento Mensal</h2><p className="text-4xl font-bold text-brand-blue">{monthlyRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p></div>
                 <div className="bg-white p-6 rounded-lg shadow flex flex-col justify-center items-center">
                    <h2 className="text-lg font-semibold text-gray-600 mb-2">Ações Rápidas</h2>
                    <Button onClick={() => setIsMessageModalOpen(true)}>Enviar Oferta de Renovação</Button>
                </div>
            </div>
            <Modal isOpen={isMessageModalOpen} onClose={() => setIsMessageModalOpen(false)} title="Enviar Mensagem Promocional">
                <div className="space-y-4">
                    <p>Você está prestes a enviar uma mensagem para todos os usuários do sistema. Personalize a mensagem abaixo:</p>
                    <TextArea rows={5} defaultValue="Olá! Temos uma oferta especial para você renovar sua assinatura do Lava Rápido Pro. Garanta já seu desconto!" />
                    <div className="flex justify-end gap-3 pt-4">
                       <Button type="button" variant="secondary" onClick={() => setIsMessageModalOpen(false)}>Cancelar</Button>
                       <Button onClick={handleSendMessage}>Enviar para todos</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

const AddDaysControl = ({ userId, onAdd }: { userId: string; onAdd: (userId: string, days: number) => void; }) => {
    const [days, setDays] = useState(30);

    const handleAdd = () => {
        if (days > 0) {
            onAdd(userId, days);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <Input
                type="number"
                value={days}
                onChange={e => setDays(parseInt(e.target.value) || 0)}
                className="w-20 !py-1"
                onClick={e => e.stopPropagation()}
            />
            <Button onClick={(e) => { e.stopPropagation(); handleAdd(); }} className="!px-2 !py-1 text-xs">
                Adicionar
            </Button>
        </div>
    );
};


const AdminUsersPage = ({ users, onUpdateSubscription, onAddSubscriptionDays }: { users: User[], onUpdateSubscription: (userId: string, status: User['subscriptionStatus']) => void, onAddSubscriptionDays: (userId: string, days: number) => void }) => {
    const [filter, setFilter] = useState('all');

    const filteredUsers = useMemo(() => {
        const allUsers = users.filter(u => u.role === 'user');
        if (filter === 'all') return allUsers;

        const now = new Date();
        return allUsers.filter(user => {
            const isExpired = now > new Date(user.subscriptionEndDate);

            switch(filter) {
                case 'trial': return user.subscriptionStatus === 'trial' && !isExpired;
                case 'expired': return isExpired;
                case 'active': return !isExpired;
                default: return true;
            }
        });
    }, [users, filter]);

    return (
        <div>
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <h1 className="text-3xl font-bold text-gray-800">Gerenciamento de Usuários</h1>
                <div className="flex items-center gap-2">
                    <Button variant={filter === 'all' ? 'primary' : 'secondary'} onClick={() => setFilter('all')}>Todos</Button>
                    <Button variant={filter === 'active' ? 'primary' : 'secondary'} onClick={() => setFilter('active')}>Ativos</Button>
                    <Button variant={filter === 'trial' ? 'primary' : 'secondary'} onClick={() => setFilter('trial')}>Em Teste</Button>
                    <Button variant={filter === 'expired' ? 'primary' : 'secondary'} onClick={() => setFilter('expired')}>Expirados</Button>
                </div>
            </div>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50"><tr><th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome / Email</th><th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th><th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expira em</th><th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plano</th><th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adicionar Dias</th></tr></thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.map(user => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{user.name}</div><div className="text-sm text-gray-500">{user.email}</div></td>
                                    <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.subscriptionStatus === 'trial' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{user.subscriptionStatus}</span></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(user.subscriptionEndDate).toLocaleDateString('pt-BR')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <select onChange={(e) => onUpdateSubscription(user.id, e.target.value as any)} value={user.subscriptionStatus} className="text-sm rounded-md border-gray-300 focus:ring-brand-blue focus:border-brand-blue" disabled={user.role === 'admin'}>
                                            <option value="trial">trial</option>
                                            <option value="monthly">monthly</option>
                                            <option value="quarterly">quarterly</option>
                                            <option value="yearly">yearly</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <AddDaysControl userId={user.id} onAdd={onAddSubscriptionDays} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const AdminTicketDetailModal = ({ ticket, onClose, onReply }: { ticket: Ticket | null, onClose: () => void, onReply: (ticketId: string, replyText: string) => void }) => {
    const [replyText, setReplyText] = useState('');
    if (!ticket) return null;

    const handleReply = () => {
        if (replyText.trim()) {
            onReply(ticket.id, replyText);
            setReplyText('');
            onClose();
        }
    };

    return (
        <Modal isOpen={!!ticket} onClose={onClose} title={`Ticket: ${ticket.title}`}>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                <div className="bg-gray-50 p-3 rounded-md">
                    <div className="flex justify-between items-center mb-1">
                        <p className="font-semibold text-sm text-gray-700">Usuário ({ticket.userEmail})</p>
                        <p className="text-xs text-gray-400">{new Date(ticket.createdAt).toLocaleString('pt-BR')}</p>
                    </div>
                    <p className="text-gray-600 whitespace-pre-wrap">{ticket.description}</p>
                </div>
                {ticket.replies.map(reply => (
                    <div key={reply.createdAt} className={`p-3 rounded-md ${reply.author === 'admin' ? 'bg-blue-50' : 'bg-gray-50'}`}>
                        <div className="flex justify-between items-center mb-1">
                             <p className="font-semibold text-sm text-gray-700">{reply.author === 'admin' ? 'Suporte (Você)' : 'Usuário'}</p>
                             <p className="text-xs text-gray-400">{new Date(reply.createdAt).toLocaleString('pt-BR')}</p>
                        </div>
                        <p className="text-gray-600 whitespace-pre-wrap">{reply.text}</p>
                    </div>
                ))}
                <div className="pt-4 border-t">
                     <h3 className="text-lg font-medium text-gray-800 mb-2">Responder ao Ticket</h3>
                    <TextArea rows={4} placeholder="Digite sua resposta aqui..." value={replyText} onChange={e => setReplyText(e.target.value)} />
                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="secondary" onClick={onClose}>Fechar</Button>
                        <Button onClick={handleReply}>Enviar Resposta</Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}


const AdminTicketsPage = ({ tickets, onUpdateStatus, onReply }: { tickets: Ticket[], onUpdateStatus: (ticketId: string, status: TicketStatus) => void, onReply: (ticketId: string, replyText: string) => void }) => {
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Tickets de Suporte</h1>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                 <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50"><tr><th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuário</th><th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th><th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th><th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th><th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th></tr></thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {tickets.map(ticket => (
                                <tr key={ticket.id} onClick={() => setSelectedTicket(ticket)} className="hover:bg-gray-50 cursor-pointer">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.userEmail}</td>
                                    <td className="px-6 py-4"><div className="text-sm font-medium text-gray-900">{ticket.title}</div><p className="text-sm text-gray-500 max-w-xs truncate">{ticket.description}</p></td>
                                    <td className="px-6 py-4 whitespace-nowrap"><TicketStatusBadge status={ticket.status} /></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(ticket.createdAt).toLocaleDateString('pt-BR')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" onClick={e => e.stopPropagation()}>
                                        <select onChange={(e) => onUpdateStatus(ticket.id, e.target.value as TicketStatus)} value={ticket.status} className="text-sm rounded-md border-gray-300 focus:ring-brand-blue focus:border-brand-blue">
                                            <option>Aberto</option>
                                            <option>Respondido</option>
                                            <option>Finalizado</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <AdminTicketDetailModal ticket={selectedTicket} onClose={() => setSelectedTicket(null)} onReply={onReply} />
        </div>
    );
}

const AdminPortal = ({ auth, tickets, onUpdateTicketStatus, onReplyToTicket }: { auth: ReturnType<typeof useAuth>, tickets: Ticket[], onUpdateTicketStatus: (ticketId: string, status: TicketStatus) => void, onReplyToTicket: (ticketId: string, replyText: string) => void }) => {
    const [adminView, setAdminView] = useState<'dashboard' | 'users' | 'tickets'>('dashboard');
    const { logout, addSubscriptionDays } = auth;
    const allUsers = useMemo(() => auth.getAllUsers(), [auth]);
    
    const renderContent = () => {
        switch(adminView) {
            case 'dashboard': return <AdminDashboard users={allUsers} />;
            case 'users': return <AdminUsersPage users={allUsers} onUpdateSubscription={auth.updateUserSubscription} onAddSubscriptionDays={addSubscriptionDays} />;
            case 'tickets': return <AdminTicketsPage tickets={tickets} onUpdateStatus={onUpdateTicketStatus} onReply={onReplyToTicket}/>;
            default: return null;
        }
    };

    const NavItem = ({ icon, label, viewName }: { icon: React.ReactNode, label: string, viewName: typeof adminView }) => (
        <li><button onClick={() => setAdminView(viewName)} className={`flex items-center p-3 text-base font-normal rounded-lg transition-colors w-full text-left ${adminView === viewName ? 'bg-brand-blue text-white' : 'text-gray-900 hover:bg-gray-200'}`}>{icon}<span className="ml-3">{label}</span></button></li>
    );

    return (
        <div className="flex h-screen bg-brand-gray-light">
            <aside className="w-64 bg-white shadow-md flex-shrink-0 flex flex-col">
                <div className="p-4 border-b"><div className="flex items-center gap-3"><CogIcon className="h-10 w-10 text-brand-blue"/><h1 className="text-2xl font-bold text-gray-800">Admin</h1></div></div>
                <nav className="p-4 flex-grow"><ul className="space-y-2">
                    <NavItem icon={<ChartBarIcon className="w-6 h-6"/>} label="Dashboard" viewName="dashboard" />
                    <NavItem icon={<UserGroupIcon className="w-6 h-6"/>} label="Usuários" viewName="users" />
                    <NavItem icon={<ChatBubbleLeftRightIcon className="w-6 h-6"/>} label="Tickets" viewName="tickets" />
                </ul></nav>
                <div className="p-4 border-t"><button onClick={logout} className="flex items-center p-3 text-base font-normal rounded-lg transition-colors w-full text-left text-gray-900 hover:bg-red-100 hover:text-red-700"><LogoutIcon className="w-6 h-6"/><span className="ml-3">Sair</span></button></div>
            </aside>
            <main className="flex-1 p-8 overflow-y-auto">{renderContent()}</main>
        </div>
    );
};


// --- Auth and Subscription Components ---
const AuthForm = ({ title, buttonText, onSubmit, isLogin = false, onSwitch, onBackToLanding }: { title: string, buttonText: string, onSubmit: (data: { email: string, password: string, name?: string, phone?: string }) => void, isLogin?: boolean, onSwitch: () => void, onBackToLanding: () => void }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await onSubmit({ email, password, name, phone });
        } catch (err: any) {
            setError(err.message);
        }
    };
    
    return (
        <div className="min-h-screen bg-brand-gray-light flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-md">
                <button onClick={onBackToLanding} className="flex justify-center items-center gap-3 mb-6 w-full text-left focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue rounded-lg p-2">
                    <CarWashIcon className="h-12 w-12 text-brand-blue"/>
                    <h1 className="text-4xl font-bold text-gray-800">Lava Rápido Pro</h1>
                </button>
                <div className="bg-white p-8 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">{title}</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <>
                                <Input type="text" placeholder="Nome Completo" value={name} onChange={e => setName(e.target.value)} required />
                                <Input type="tel" placeholder="Telefone (ex: 55119...)" value={phone} onChange={e => setPhone(e.target.value)} required />
                            </>
                        )}
                        <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
                        <Input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} required />

                        {isLogin && (
                           <div className="flex items-center justify-between">
                               <div className="flex items-center">
                                   <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-brand-blue focus:ring-brand-blue border-gray-300 rounded" />
                                   <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Salvar Senha</label>
                               </div>
                               <div className="text-sm">
                                   <button type="button" onClick={() => alert('Função de recuperação de senha em desenvolvimento.')} className="font-medium text-brand-blue hover:text-brand-blue-dark">Esqueci a senha</button>
                               </div>
                           </div>
                        )}

                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <Button type="submit" className="w-full">{buttonText}</Button>
                    </form>
                    <p className="text-center text-sm text-gray-600 mt-6">
                        {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}
                        <button onClick={onSwitch} className="font-medium text-brand-blue hover:underline ml-1">
                            {isLogin ? "Cadastre-se" : "Faça Login"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    )
}

const SubscriptionWall = ({ onSelectPlan, onLogout }: { onSelectPlan: (planId: string, planName: string) => void, onLogout: () => void }) => {
    const plans = [
        { id: 'monthly', name: 'Mensal', price: '49,90', per: 'mês' },
        { id: 'quarterly', name: 'Trimestral', price: '129,90', per: '3 meses' },
        { id: 'yearly', name: 'Anual', price: '478,80', per: 'ano', best: true },
    ];
    return (
        <div className="fixed inset-0 bg-brand-gray-dark bg-opacity-95 z-50 flex flex-col justify-center items-center p-4 text-white">
            <LockClosedIcon className="h-16 w-16 text-yellow-400 mb-4" />
            <h1 className="text-4xl font-bold mb-2">Sua assinatura expirou!</h1>
            <p className="text-lg text-gray-300 mb-8">Para continuar usando o sistema, por favor, entre em contato para escolher um plano.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
                {plans.map(plan => (
                    <div key={plan.id} className={`bg-gray-800 p-8 rounded-lg border-2 ${plan.best ? 'border-brand-blue' : 'border-gray-700'} text-center flex flex-col`}>
                        <h2 className="text-2xl font-bold mb-4">{plan.name}</h2>
                        <p className="text-5xl font-bold mb-2">R${plan.price}</p>
                        <p className="text-gray-400 mb-6">/{plan.per}</p>
                        <Button onClick={() => onSelectPlan(plan.id, plan.name)} className="mt-auto w-full">
                            <WhatsAppIcon className="h-5 w-5" /> Entrar em Contato
                        </Button>
                    </div>
                ))}
            </div>
             <button onClick={onLogout} className="mt-8 text-gray-400 hover:text-white transition">Sair</button>
        </div>
    );
};

const WhatsAppOfferModal = ({ isOpen, onClose, client, offers }: { isOpen: boolean, onClose: () => void, client: Client, offers: Offer[] }) => {
    const [selectedOfferId, setSelectedOfferId] = useState('');
    const [customMessage, setCustomMessage] = useState('');

    useEffect(() => {
        if (isOpen) {
            const selectedOffer = offers.find(o => o.id === selectedOfferId);
            let message;
            if (selectedOffer) {
                message = `Olá ${client.name}! Temos uma oferta especial para você: ${selectedOffer.name} (${selectedOffer.discountPercentage}% de desconto). Apresente esta mensagem para garantir seu desconto. Aproveite!`;
            } else {
                message = `Olá ${client.name}! Passando para lembrar que estamos te esperando para a próxima lavagem!`;
            }
            setCustomMessage(message);
        }
    }, [selectedOfferId, client, offers, isOpen]);
    
    if (!isOpen) return null;

    const handleSend = () => {
        const whatsAppUrl = `https://wa.me/${client.phone.replace(/\D/g, '')}?text=${encodeURIComponent(customMessage)}`;
        window.open(whatsAppUrl, '_blank', 'noopener,noreferrer');
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Enviar Mensagem via WhatsApp">
            <div className="space-y-4">
                <div>
                    <label htmlFor="whatsapp-offer-select" className="block text-sm font-medium text-gray-700">Selecione uma oferta para incluir</label>
                    <select 
                        id="whatsapp-offer-select" 
                        value={selectedOfferId} 
                        onChange={e => setSelectedOfferId(e.target.value)} 
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm rounded-md"
                    >
                        <option value="">Nenhuma oferta (mensagem padrão)</option>
                        {offers.map(offer => (
                            <option key={offer.id} value={offer.id}>{offer.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="whatsapp-message" className="block text-sm font-medium text-gray-700">Prévia da Mensagem</label>
                    <TextArea 
                        id="whatsapp-message"
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue transition mt-1"
                        value={customMessage}
                        onChange={e => setCustomMessage(e.target.value)}
                    />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
                    <Button onClick={handleSend} className="bg-green-500 hover:bg-green-600 focus:ring-green-500">
                        <WhatsAppIcon className="h-5 w-5" /> Enviar no WhatsApp
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

const TrialBanner = ({ user, onUpgrade }: { user: User, onUpgrade: () => void }) => {
    const daysLeft = useMemo(() => {
        const diff = new Date(user.subscriptionEndDate).getTime() - new Date().getTime();
        return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    }, [user.subscriptionEndDate]);
    
    if (user.subscriptionStatus !== 'trial' || daysLeft === 0) return null;

    return (
        <div className="bg-yellow-400 text-yellow-900 px-4 py-2 text-center text-sm font-medium flex justify-center items-center gap-4">
            <span>Seu período de teste termina em <strong>{daysLeft} dia{daysLeft > 1 ? 's' : ''}</strong>.</span>
            <Button onClick={onUpgrade} className="bg-yellow-800 text-white hover:bg-yellow-900 focus:ring-yellow-700 !px-3 !py-1 text-sm">
                <RocketLaunchIcon className="h-4 w-4" />
                Upgrade
            </Button>
        </div>
    );
};


// --- Main Application Component ---
const MainApp = ({ auth, tickets, onAddTicket, onUpgradeClick }: { auth: ReturnType<typeof useAuth>, tickets: Ticket[], onAddTicket: (data: { title: string, description: string }) => void, onUpgradeClick: () => void }) => {
    const { currentUser, logout } = auth;
    const [view, setView] = useState<View>('dashboard');
    const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
    const [isClientModalOpen, setIsClientModalOpen] = useState(false);
    const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
    const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
    const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
    const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
    const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
    
    const data = useData(currentUser?.id || null);
    
    const isTrialActive = currentUser?.subscriptionStatus === 'trial';

    const navigate = (newView: View) => { setView(newView); setSelectedClientId(null); };
    const handleSelectClient = (clientId: string) => { setSelectedClientId(clientId); setView('clientDetail'); };
    const handleSaveClient = (client: Omit<Client, 'id'>) => { data.addClient(client); setIsClientModalOpen(false); };
    const handleSaveService = (service: Omit<Service, 'id'>) => { data.addService(service); setIsServiceModalOpen(false); };
    const handleSaveOffer = (offer: Omit<Offer, 'id'>) => { data.addOffer(offer); setIsOfferModalOpen(false); };
    const handleSaveRecord = (record: Omit<ServiceRecord, 'id'>) => { data.addRecord(record); setIsRecordModalOpen(false); };
    const handleSaveTicket = (ticketData: { title: string, description: string }) => { onAddTicket(ticketData); setIsTicketModalOpen(false); }

    const renderContent = () => {
        switch (view) {
            case 'dashboard': return <Dashboard data={data} />;
            case 'clients': return <ClientsPage data={data} onSelectClient={handleSelectClient} onAddClient={() => setIsClientModalOpen(true)} />;
            case 'services': return <ServicesPage data={data} onAddService={() => setIsServiceModalOpen(true)} />;
            case 'offers': return <OffersPage data={data} onAddOffer={() => setIsOfferModalOpen(true)} />;
            case 'help': return <HelpPage tickets={tickets} onAddTicket={() => setIsTicketModalOpen(true)} />;
            case 'clientDetail':
                if (selectedClientId) {
                    return <ClientDetailPage clientId={selectedClientId} data={data} onBack={() => setView('clients')} onAddRecord={() => setIsRecordModalOpen(true)} onSendMessage={() => setIsWhatsAppModalOpen(true)} />;
                }
                return null;
            default: return <Dashboard data={data} />;
        }
    };

    const NavItem = ({ icon, label, targetView }: { icon: React.ReactNode, label: string, targetView: View }) => {
        return (
            <li><button onClick={() => navigate(targetView)} className={`flex items-center p-3 text-base font-normal rounded-lg transition-colors w-full text-left ${view === targetView ? 'bg-brand-blue text-white' : 'text-gray-900 hover:bg-gray-200'}`}>{icon}<span className="ml-3">{label}</span></button></li>
        );
    };

    const selectedClientForRecord = data.clients.find(c => c.id === selectedClientId);

    return (
        <div className="flex flex-col h-screen bg-brand-gray-light">
            {isTrialActive && <TrialBanner user={currentUser!} onUpgrade={onUpgradeClick} />}
            <div className="flex flex-1 overflow-hidden">
                <aside className="w-64 bg-white shadow-md flex-shrink-0 flex flex-col">
                    <div className="p-4 border-b"><div className="flex items-center gap-3"><CarWashIcon className="h-10 w-10 text-brand-blue"/><h1 className="text-2xl font-bold text-gray-800">Lava Rápido</h1></div></div>
                    <nav className="p-4 flex-grow"><ul className="space-y-2">
                        <NavItem icon={<ChartBarIcon className="w-6 h-6"/>} label="Dashboard" targetView="dashboard" />
                        <NavItem icon={<UsersIcon className="w-6 h-6"/>} label="Clientes" targetView="clients" />
                        <NavItem icon={<WrenchScrewdriverIcon className="w-6 h-6"/>} label="Serviços" targetView="services" />
                        <NavItem icon={<TagIcon className="w-6 h-6"/>} label="Ofertas" targetView="offers" />
                        <NavItem icon={<QuestionMarkCircleIcon className="w-6 h-6"/>} label="Ajuda" targetView="help" />
                    </ul></nav>
                    <div className="p-4 border-t"><button onClick={logout} className="flex items-center p-3 text-base font-normal rounded-lg transition-colors w-full text-left text-gray-900 hover:bg-red-100 hover:text-red-700"><LogoutIcon className="w-6 h-6"/><span className="ml-3">Sair</span></button></div>
                </aside>

                <main className="flex-1 p-8 overflow-y-auto">{renderContent()}</main>
            </div>
            <Modal isOpen={isClientModalOpen} onClose={() => setIsClientModalOpen(false)} title="Novo Cliente"><ClientForm onSave={handleSaveClient} onCancel={() => setIsClientModalOpen(false)} /></Modal>
            <Modal isOpen={isServiceModalOpen} onClose={() => setIsServiceModalOpen(false)} title="Novo Serviço"><ServiceForm onSave={handleSaveService} onCancel={() => setIsServiceModalOpen(false)} /></Modal>
            <Modal isOpen={isOfferModalOpen} onClose={() => setIsOfferModalOpen(false)} title="Nova Oferta"><OfferForm onSave={handleSaveOffer} onCancel={() => setIsOfferModalOpen(false)} /></Modal>
            <Modal isOpen={isTicketModalOpen} onClose={() => setIsTicketModalOpen(false)} title="Abrir Novo Ticket"><TicketForm onSave={handleSaveTicket} onCancel={() => setIsTicketModalOpen(false)} /></Modal>
            {selectedClientForRecord && (<Modal isOpen={isRecordModalOpen} onClose={() => setIsRecordModalOpen(false)} title={`Novo Serviço para ${selectedClientForRecord.name}`}><ServiceRecordForm client={selectedClientForRecord} services={data.services} offers={data.offers} onSave={handleSaveRecord} onCancel={() => setIsRecordModalOpen(false)} /></Modal>)}
            {selectedClientForRecord && (<WhatsAppOfferModal isOpen={isWhatsAppModalOpen} onClose={() => setIsWhatsAppModalOpen(false)} client={selectedClientForRecord} offers={data.offers} />)}
        </div>
    );
};


export default function App() {
    const auth = useAuth();
    const [authView, setAuthView] = useState<'landing' | 'login' | 'register'>('landing');
    const [tickets, setTickets] = useLocalStorage<Ticket[]>('tickets', []);
    const [isSubscriptionWallVisible, setIsSubscriptionWallVisible] = useState(false);

    if (auth.isAuthLoading) {
        return <div className="h-screen w-screen flex justify-center items-center"><p>Carregando...</p></div>;
    }

    if (!auth.currentUser) {
        const handleAuthSubmit = async (data: { email: string; password: string; name?: string; phone?: string; }) => {
            const isLogin = authView === 'login';
            const result = isLogin
                ? auth.login(data.email, data.password) 
                : auth.register({ name: data.name!, phone: data.phone!, email: data.email, password: data.password });
            if (!result.success) {
                throw new Error(result.message);
            }
        };

        switch (authView) {
            case 'landing':
                return <LandingPage 
                    onLoginClick={() => setAuthView('login')} 
                    onRegisterClick={() => setAuthView('register')} 
                />;
            case 'login':
            case 'register':
                return <AuthForm
                    title={authView === 'login' ? "Login" : "Cadastro"}
                    buttonText={authView === 'login' ? "Entrar" : "Criar Conta e iniciar teste"}
                    onSubmit={handleAuthSubmit}
                    isLogin={authView === 'login'}
                    onSwitch={() => setAuthView(authView === 'login' ? 'register' : 'login')}
                    onBackToLanding={() => setAuthView('landing')}
                />
        }
    }

    const { currentUser, logout } = auth;
    
    const isSubscriptionExpired = new Date() > new Date(currentUser.subscriptionEndDate);
    const showSubscriptionWall = (isSubscriptionExpired || isSubscriptionWallVisible) && currentUser.role !== 'admin';
    
    const handleSelectPlan = (planId: string, planName: string) => {
        if (!currentUser) return;
        const adminPhoneNumber = '558291058510';
        const message = `Olá! Tenho interesse em contratar o plano ${planName} do Lava Rápido Pro. Meu email de cadastro é: ${currentUser.email}`;
        const whatsAppUrl = `https://wa.me/${adminPhoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsAppUrl, '_blank', 'noopener,noreferrer');
    };

    if (showSubscriptionWall) {
        return <SubscriptionWall onSelectPlan={handleSelectPlan} onLogout={logout} />
    }

    // --- Admin Portal ---
    if (currentUser.role === 'admin') {
        const handleUpdateTicketStatus = (ticketId: string, status: TicketStatus) => {
            setTickets(currentTickets => currentTickets.map(t => t.id === ticketId ? { ...t, status } : t));
        };
        const handleReplyToTicket = (ticketId: string, replyText: string) => {
            setTickets(currentTickets => currentTickets.map(t => {
                if (t.id === ticketId) {
                    const newReply: TicketReply = {
                        author: 'admin',
                        text: replyText,
                        createdAt: new Date().toISOString(),
                    };
                    return { ...t, status: 'Respondido', replies: [...t.replies, newReply] };
                }
                return t;
            }));
        };
        return <AdminPortal auth={auth} tickets={tickets} onUpdateTicketStatus={handleUpdateTicketStatus} onReplyToTicket={handleReplyToTicket} />;
    }
    
    // --- User App ---
    const handleAddTicket = ({ title, description }: { title: string, description: string }) => {
        const newTicket: Ticket = {
            id: new Date().toISOString(),
            userId: currentUser.id,
            userEmail: currentUser.email,
            title,
            description,
            status: 'Aberto',
            createdAt: new Date().toISOString(),
            replies: [],
        };
        setTickets(prev => [...prev, newTicket].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    };
    
    const userTickets = tickets.filter(t => t.userId === currentUser.id);

    return <MainApp auth={auth} tickets={userTickets} onAddTicket={handleAddTicket} onUpgradeClick={() => setIsSubscriptionWallVisible(true)} />;
}