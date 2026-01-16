import React, { useState, useEffect, useMemo } from 'react';

// === DONNÉES INITIALES ===
const INITIAL_PRODUCTS = [
  {"id":"sucré_1","nomOMC":"Tarte Banane","nomFournisseur":"Tarte Banane","categorie":"Sucré","sousCategorie":"Tarte","fournisseur":"SIP","stockage":"Freeze","cuisson":true,"prixFournisseur":23,"lot":1,"prixUnitaire":23,"packingType":"Sachet","packing":5,"transformation":"cuisson","coutTransformation":7,"vatApplicable":true,"prixVente":110,"selectionneOMC":true,"notes":""},
  {"id":"sucré_2","nomOMC":"Tarte Fraise","nomFournisseur":"Tarte fraise","categorie":"Sucré","sousCategorie":"Tarte","fournisseur":"SIP","stockage":"Frais","cuisson":false,"prixFournisseur":110,"lot":1,"prixUnitaire":110,"packingType":"Sachet","packing":5,"transformation":"aucune","coutTransformation":0,"vatApplicable":true,"prixVente":230,"selectionneOMC":true,"notes":""},
  {"id":"sucré_3","nomOMC":"Tarte Fruit","nomFournisseur":"Tarte fruit","categorie":"Sucré","sousCategorie":"Tarte","fournisseur":"SIP","stockage":"Frais","cuisson":false,"prixFournisseur":90,"lot":1,"prixUnitaire":90,"packingType":"Sachet","packing":5,"transformation":"aucune","coutTransformation":0,"vatApplicable":true,"prixVente":230,"selectionneOMC":true,"notes":""},
  {"id":"sucré_4","nomOMC":"Tarte Citron","nomFournisseur":"Tarte citron","categorie":"Sucré","sousCategorie":"Tarte","fournisseur":"SIP","stockage":"Frais","cuisson":false,"prixFournisseur":80,"lot":1,"prixUnitaire":80,"packingType":"Sachet","packing":5,"transformation":"aucune","coutTransformation":0,"vatApplicable":true,"prixVente":210,"selectionneOMC":true,"notes":""},
  {"id":"sucré_5","nomOMC":"Cheesecake Passion","nomFournisseur":"Cheese cake passion","categorie":"Sucré","sousCategorie":"Cheesecake","fournisseur":"SIP","stockage":"Freeze","cuisson":false,"prixFournisseur":1300,"lot":12,"prixUnitaire":108.33,"packingType":"Sachet","packing":5,"transformation":"aucune","coutTransformation":0,"vatApplicable":true,"prixVente":250,"selectionneOMC":true,"notes":""},
  {"id":"sucré_6","nomOMC":"Cheesecake Oreo","nomFournisseur":"Cheese Cake oreo","categorie":"Sucré","sousCategorie":"Cheesecake","fournisseur":"SIP","stockage":"Freeze","cuisson":false,"prixFournisseur":1300,"lot":12,"prixUnitaire":108.33,"packingType":"Sachet","packing":5,"transformation":"aucune","coutTransformation":0,"vatApplicable":true,"prixVente":250,"selectionneOMC":true,"notes":""},
  {"id":"sucré_7","nomOMC":"Mousse Chocolat","nomFournisseur":"mouse au chocolat","categorie":"Sucré","sousCategorie":"Mousse","fournisseur":"SIP","stockage":"Freeze","cuisson":false,"prixFournisseur":450,"lot":5,"prixUnitaire":90,"packingType":"Sachet","packing":5,"transformation":"aucune","coutTransformation":0,"vatApplicable":true,"prixVente":250,"selectionneOMC":true,"notes":""},
  {"id":"sucré_8","nomOMC":"Cookie Chocolat","nomFournisseur":"Biscuit pepite chocolat","categorie":"Sucré","sousCategorie":"Cookie","fournisseur":"SIP","stockage":"Sec","cuisson":false,"prixFournisseur":156,"lot":6,"prixUnitaire":26,"packingType":"Sachet","packing":5,"transformation":"aucune","coutTransformation":0,"vatApplicable":true,"prixVente":50,"selectionneOMC":true,"notes":""},
  {"id":"sucré_9","nomOMC":"Cheesecake Chocolat","nomFournisseur":"cheesecake chocolat unité","categorie":"Sucré","sousCategorie":"Cheesecake","fournisseur":"SIP","stockage":"Freeze","cuisson":false,"prixFournisseur":510,"lot":6,"prixUnitaire":85,"packingType":"Sachet","packing":5,"transformation":"aucune","coutTransformation":0,"vatApplicable":true,"prixVente":250,"selectionneOMC":true,"notes":""},
  {"id":"sucré_10","nomOMC":"Crème Brûlée","nomFournisseur":"Creme Brule","categorie":"Sucré","sousCategorie":"Dessert","fournisseur":"SIP","stockage":"Freeze","cuisson":true,"prixFournisseur":450,"lot":5,"prixUnitaire":90,"packingType":"Sachet","packing":5,"transformation":"cuisson","coutTransformation":7,"vatApplicable":true,"prixVente":250,"selectionneOMC":true,"notes":""},
  {"id":"sucré_11","nomOMC":"Death by Chocolate","nomFournisseur":"Deth by Choco","categorie":"Sucré","sousCategorie":"Gâteau","fournisseur":"SIP","stockage":"Freeze","cuisson":false,"prixFournisseur":1300,"lot":12,"prixUnitaire":108.33,"packingType":"Sachet","packing":5,"transformation":"aucune","coutTransformation":0,"vatApplicable":true,"prixVente":300,"selectionneOMC":true,"notes":""},
  {"id":"sucré_12","nomOMC":"Carrot Cake","nomFournisseur":"Carrot cake","categorie":"Sucré","sousCategorie":"Gâteau","fournisseur":"SIP","stockage":"Freeze","cuisson":false,"prixFournisseur":1300,"lot":12,"prixUnitaire":108.33,"packingType":"Sachet","packing":5,"transformation":"aucune","coutTransformation":0,"vatApplicable":true,"prixVente":300,"selectionneOMC":true,"notes":""},
  {"id":"sucré_13","nomOMC":"Tarte Amande","nomFournisseur":"Tarte Amande","categorie":"Sucré","sousCategorie":"Tarte","fournisseur":"SIP","stockage":"Frais","cuisson":false,"prixFournisseur":25,"lot":1,"prixUnitaire":25,"packingType":"Sachet","packing":5,"transformation":"aucune","coutTransformation":0,"vatApplicable":true,"prixVente":110,"selectionneOMC":true,"notes":""},
  {"id":"sale_1","nomOMC":"Steak Boeuf Pré-cuit","nomFournisseur":"Beef burger Patty cuit Unit","categorie":"Salé","sousCategorie":"Produit brut","fournisseur":"SIP","stockage":"Freeze","cuisson":false,"prixFournisseur":71.5,"lot":1,"prixUnitaire":71.5,"packingType":"Aucun","packing":0,"transformation":"aucune","coutTransformation":0,"vatApplicable":true,"prixVente":85,"selectionneOMC":false,"notes":"Produit brut pour assemblage"},
  {"id":"sale_2","nomOMC":"Club Sandwich","nomFournisseur":"Club Sandwich","categorie":"Salé","sousCategorie":"Sandwich","fournisseur":"SIP","stockage":"Frais","cuisson":true,"prixFournisseur":125,"lot":1,"prixUnitaire":125,"packingType":"Boite","packing":15,"transformation":"cuisson","coutTransformation":7,"vatApplicable":true,"prixVente":210,"selectionneOMC":true,"notes":""},
  {"id":"sale_3","nomOMC":"Club Sandwich Poulet","nomFournisseur":"Club Sandwich (POULET)","categorie":"Salé","sousCategorie":"Sandwich","fournisseur":"SIP","stockage":"Frais","cuisson":true,"prixFournisseur":300,"lot":2,"prixUnitaire":150,"packingType":"Boite","packing":15,"transformation":"cuisson","coutTransformation":7,"vatApplicable":true,"prixVente":250,"selectionneOMC":true,"notes":""},
  {"id":"sale_4","nomOMC":"Croque Monsieur Jambon","nomFournisseur":"Croque Monsieur Jambon de volaille","categorie":"Salé","sousCategorie":"Croque","fournisseur":"SIP","stockage":"Freeze","cuisson":true,"prixFournisseur":156,"lot":2,"prixUnitaire":78,"packingType":"Boite","packing":15,"transformation":"cuisson","coutTransformation":7,"vatApplicable":true,"prixVente":200,"selectionneOMC":true,"notes":""},
  {"id":"sale_5","nomOMC":"Croque Monsieur Poulet","nomFournisseur":"Croque Monsieur poulet fume","categorie":"Salé","sousCategorie":"Croque","fournisseur":"SIP","stockage":"Freeze","cuisson":true,"prixFournisseur":156,"lot":2,"prixUnitaire":78,"packingType":"Boite","packing":15,"transformation":"cuisson","coutTransformation":7,"vatApplicable":true,"prixVente":200,"selectionneOMC":true,"notes":""},
  {"id":"sale_6","nomOMC":"Crouton Nature","nomFournisseur":"Crouton nature 100G","categorie":"Salé","sousCategorie":"Accompagnement","fournisseur":"SIP","stockage":"Sec","cuisson":false,"prixFournisseur":60,"lot":3,"prixUnitaire":20,"packingType":"Aucun","packing":0,"transformation":"aucune","coutTransformation":0,"vatApplicable":false,"prixVente":23,"selectionneOMC":false,"notes":""},
  {"id":"sale_7","nomOMC":"Fromage Chèvre Pané","nomFournisseur":"Fromage de chevre pane","categorie":"Salé","sousCategorie":"Produit brut","fournisseur":"SIP","stockage":"Freeze","cuisson":true,"prixFournisseur":1378,"lot":20,"prixUnitaire":68.9,"packingType":"Aucun","packing":0,"transformation":"cuisson","coutTransformation":7,"vatApplicable":true,"prixVente":80,"selectionneOMC":false,"notes":""},
  {"id":"sale_8","nomOMC":"Mix Salade","nomFournisseur":"Mix salade 400G","categorie":"Salé","sousCategorie":"Accompagnement","fournisseur":"SIP","stockage":"Frais","cuisson":false,"prixFournisseur":175,"lot":4,"prixUnitaire":43.75,"packingType":"Aucun","packing":0,"transformation":"aucune","coutTransformation":0,"vatApplicable":false,"prixVente":50,"selectionneOMC":false,"notes":""},
  {"id":"sale_9","nomOMC":"Pain Burger","nomFournisseur":"pain buger","categorie":"Salé","sousCategorie":"Pain","fournisseur":"SIP","stockage":"Sec","cuisson":false,"prixFournisseur":57.6,"lot":6,"prixUnitaire":9.6,"packingType":"Aucun","packing":0,"transformation":"aucune","coutTransformation":0,"vatApplicable":false,"prixVente":11,"selectionneOMC":false,"notes":""},
  {"id":"sale_10","nomOMC":"Pain de Seigle","nomFournisseur":"Pain de seigle","categorie":"Salé","sousCategorie":"Pain","fournisseur":"SIP","stockage":"Sec","cuisson":false,"prixFournisseur":57.6,"lot":1,"prixUnitaire":57.6,"packingType":"Aucun","packing":0,"transformation":"aucune","coutTransformation":0,"vatApplicable":false,"prixVente":66,"selectionneOMC":false,"notes":""},
  {"id":"sale_11","nomOMC":"Sandwich Poulet Mayo","nomFournisseur":"Pain fourre chicken mayo","categorie":"Salé","sousCategorie":"Sandwich","fournisseur":"SIP","stockage":"Frais","cuisson":false,"prixFournisseur":80,"lot":1,"prixUnitaire":80,"packingType":"Boite","packing":15,"transformation":"aucune","coutTransformation":0,"vatApplicable":true,"prixVente":265,"selectionneOMC":true,"notes":""},
  {"id":"sale_12","nomOMC":"Sandwich Poulet Teriyaki","nomFournisseur":"Pain fourre Poulet teriyaki","categorie":"Salé","sousCategorie":"Sandwich","fournisseur":"SIP","stockage":"Frais","cuisson":false,"prixFournisseur":80,"lot":1,"prixUnitaire":80,"packingType":"Boite","packing":15,"transformation":"aucune","coutTransformation":0,"vatApplicable":true,"prixVente":265,"selectionneOMC":true,"notes":""},
  {"id":"sale_13","nomOMC":"Sandwich Légumes Grillés","nomFournisseur":"Pain fourre aux legume grilles","categorie":"Salé","sousCategorie":"Sandwich","fournisseur":"SIP","stockage":"Frais","cuisson":false,"prixFournisseur":75,"lot":1,"prixUnitaire":75,"packingType":"Boite","packing":15,"transformation":"aucune","coutTransformation":0,"vatApplicable":true,"prixVente":240,"selectionneOMC":true,"notes":""},
  {"id":"sale_14","nomOMC":"Quiche Lorraine","nomFournisseur":"Quiche Lorraine","categorie":"Salé","sousCategorie":"Quiche","fournisseur":"SIP","stockage":"Freeze","cuisson":true,"prixFournisseur":85,"lot":1,"prixUnitaire":85,"packingType":"Boite","packing":15,"transformation":"cuisson","coutTransformation":7,"vatApplicable":true,"prixVente":180,"selectionneOMC":true,"notes":""},
  {"id":"sale_15","nomOMC":"Quiche Saumon","nomFournisseur":"Quiche saumon","categorie":"Salé","sousCategorie":"Quiche","fournisseur":"SIP","stockage":"Freeze","cuisson":true,"prixFournisseur":95,"lot":1,"prixUnitaire":95,"packingType":"Boite","packing":15,"transformation":"cuisson","coutTransformation":7,"vatApplicable":true,"prixVente":200,"selectionneOMC":true,"notes":""}
];

const INITIAL_FOURNISSEURS = [
  {id: 'f1', nom: 'SIP', adresse: '', contact: '', modeCommande: 'Telephone', livraison: true, typeLivraison: 'Delais', typeFournisseur: 'Impot', vat: true, notes: 'Fournisseur principal'},
  {id: 'f2', nom: 'Medley', adresse: '', contact: '', modeCommande: 'Whatsapp', livraison: true, typeLivraison: 'Jours Fix', typeFournisseur: 'Production local', vat: false, notes: ''},
  {id: 'f3', nom: 'France Delice', adresse: '', contact: '', modeCommande: 'Email', livraison: true, typeLivraison: 'Delais', typeFournisseur: 'Impot', vat: true, notes: ''}
];

const INITIAL_SETTINGS = {
  vatRate: 15,
  packingTypes: [
    {id: 'p0', nom: 'Aucun', cout: 0, description: 'Pas d\'emballage'},
    {id: 'p1', nom: 'Sticker', cout: 2.5, description: 'Étiquette simple'},
    {id: 'p2', nom: 'Sachet', cout: 5, description: 'Sachet plastique petit'},
    {id: 'p3', nom: 'Grand Sachet', cout: 10, description: 'Sachet plastique grand'},
    {id: 'p4', nom: 'Boite', cout: 15, description: 'Boite carton standard'},
    {id: 'p5', nom: 'Grand Boite', cout: 20, description: 'Boite carton grande'}
  ],
  transformationTypes: [
    {id: 't0', nom: 'aucune', label: 'Aucune', cout: 0, description: 'Produit vendu tel quel'},
    {id: 't1', nom: 'cuisson', label: 'Cuisson', cout: 7, description: 'Cuisson four/micro-onde'},
    {id: 't2', nom: 'finition', label: 'Finition', cout: 5, description: 'Décoration, glaçage'},
    {id: 't3', nom: 'assemblage_simple', label: 'Assemblage simple', cout: 10, description: '2-3 composants'},
    {id: 't4', nom: 'assemblage_complexe', label: 'Assemblage complexe', cout: 20, description: '4+ composants'}
  ],
  categories: [
    {id: 'c1', nom: 'Sucré', sousCategories: ['Tarte', 'Cheesecake', 'Mousse', 'Cookie', 'Gâteau', 'Dessert', 'Autre']},
    {id: 'c2', nom: 'Salé', sousCategories: ['Sandwich', 'Croque', 'Quiche', 'Salade', 'Pain', 'Produit brut', 'Accompagnement', 'Autre']},
    {id: 'c3', nom: 'Accompagnement', sousCategories: ['Sauce', 'Frite', 'Boisson', 'Autre']}
  ],
  stockageTypes: ['Freeze', 'Frais', 'Sec'],
  seuilMargeExcellente: 60,
  seuilMargeAcceptable: 30
};

// === COMPOSANTS UTILITAIRES ===
const Badge = ({ children, variant = 'default' }) => {
  const variants = {
    default: 'bg-amber-100 text-amber-800',
    success: 'bg-emerald-100 text-emerald-800',
    warning: 'bg-orange-100 text-orange-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-sky-100 text-sky-800'
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
};

const MargeIndicator = ({ margePct, seuilExcellent, seuilAcceptable }) => {
  const pct = (margePct || 0) * 100;
  if (pct >= seuilExcellent) return <Badge variant="success">🟢 {pct.toFixed(1)}%</Badge>;
  if (pct >= seuilAcceptable) return <Badge variant="warning">🟡 {pct.toFixed(1)}%</Badge>;
  return <Badge variant="danger">🔴 {pct.toFixed(1)}%</Badge>;
};

const formatMUR = (value) => `${(value || 0).toFixed(2)} MUR`;

// Fonction utilitaire pour calculer tous les coûts d'un produit
const calculateProductCosts = (product, settings) => {
  const prixFournisseur = product.prixFournisseur || 0;
  const lot = product.lot || 1;
  const prixUnitaire = lot > 0 ? prixFournisseur / lot : 0;
  
  const transfoCout = settings.transformationTypes.find(t => t.nom === product.transformation)?.cout || 0;
  const packingCout = settings.packingTypes.find(p => p.nom === product.packingType)?.cout || product.packing || 0;
  
  const sousTotal = prixUnitaire + transfoCout + packingCout;
  const vatAchat = product.vatApplicable ? sousTotal * (settings.vatRate / 100) : 0;
  const coutFinal = sousTotal + vatAchat;
  
  const prixVente = product.prixVente || 0;
  const vatVente = product.vatApplicable ? (prixVente / (1 + settings.vatRate / 100)) * (settings.vatRate / 100) : 0;
  
  const margeBrute = prixVente - coutFinal;
  const margePct = prixVente > 0 ? margeBrute / prixVente : 0;
  const margeNette = margeBrute - vatVente;
  
  return {
    prixUnitaire,
    transfoCout,
    packingCout,
    vatAchat,
    coutFinal,
    prixVente,
    vatVente,
    margeBrute,
    margePct,
    margeNette
  };
};

// === MODAL GÉNÉRIQUE ===
const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;
  const sizes = { sm: 'max-w-md', md: 'max-w-2xl', lg: 'max-w-4xl', xl: 'max-w-6xl' };
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${sizes[size]} max-h-[90vh] overflow-hidden`}>
          <div className="sticky top-0 bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-amber-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-stone-800">{title}</h2>
            <button onClick={onClose} className="p-2 hover:bg-amber-100 rounded-full transition-colors">
              <svg className="w-5 h-5 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// === FORMULAIRE PRODUIT ===
const ProductForm = ({ product, onSave, onCancel, settings, fournisseurs }) => {
  const isEdit = !!product?.id;
  const [form, setForm] = useState(product || {
    nomOMC: '', nomFournisseur: '', categorie: 'Sucré', sousCategorie: 'Autre',
    fournisseur: fournisseurs[0]?.nom || '', stockage: 'Frais', cuisson: false,
    prixFournisseur: 0, lot: 1, packingType: 'Sachet', transformation: 'aucune',
    vatApplicable: true, prixVente: 0, selectionneOMC: false, notes: ''
  });

  const packingCout = settings.packingTypes.find(p => p.nom === form.packingType)?.cout || 0;
  const transfoCout = settings.transformationTypes.find(t => t.nom === form.transformation)?.cout || 0;
  const prixUnitaire = form.lot > 0 ? form.prixFournisseur / form.lot : 0;
  const vatAchat = form.vatApplicable ? (prixUnitaire + transfoCout + packingCout) * (settings.vatRate / 100) : 0;
  const coutFinal = prixUnitaire + transfoCout + packingCout + vatAchat;
  const vatVente = form.vatApplicable ? (form.prixVente / (1 + settings.vatRate / 100)) * (settings.vatRate / 100) : 0;
  const margeBrute = form.prixVente - coutFinal;
  const margePct = form.prixVente > 0 ? margeBrute / form.prixVente : 0;
  const margeNette = margeBrute - vatVente;

  const currentCategory = settings.categories.find(c => c.nom === form.categorie);
  const sousCategories = currentCategory?.sousCategories || ['Autre'];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      id: form.id || `prod_${Date.now()}`,
      prixUnitaire,
      packing: packingCout,
      coutTransformation: transfoCout,
      coutFinal,
      margePct,
      margeMUR: margeBrute
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* IDENTIFICATION */}
      <div className="bg-stone-50 rounded-xl p-4 space-y-4">
        <h3 className="font-semibold text-stone-700 flex items-center gap-2">
          <span className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm">1</span>
          Identification
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1">Nom OMC *</label>
            <input type="text" required value={form.nomOMC} onChange={e => setForm({...form, nomOMC: e.target.value})}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="Ex: Tarte Banane" />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1">Nom Fournisseur *</label>
            <input type="text" required value={form.nomFournisseur} onChange={e => setForm({...form, nomFournisseur: e.target.value})}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="Nom exact du fournisseur" />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1">Catégorie *</label>
            <select value={form.categorie} onChange={e => setForm({...form, categorie: e.target.value, sousCategorie: 'Autre'})}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500">
              {settings.categories.map(c => <option key={c.id} value={c.nom}>{c.nom}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1">Sous-catégorie</label>
            <select value={form.sousCategorie} onChange={e => setForm({...form, sousCategorie: e.target.value})}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500">
              {sousCategories.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* FOURNISSEUR & STOCKAGE */}
      <div className="bg-stone-50 rounded-xl p-4 space-y-4">
        <h3 className="font-semibold text-stone-700 flex items-center gap-2">
          <span className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm">2</span>
          Fournisseur & Stockage
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1">Fournisseur *</label>
            <select value={form.fournisseur} onChange={e => setForm({...form, fournisseur: e.target.value})}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500">
              {fournisseurs.map(f => <option key={f.id} value={f.nom}>{f.nom}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1">Type de stockage *</label>
            <div className="flex gap-2">
              {settings.stockageTypes.map(s => (
                <label key={s} className={`flex-1 flex items-center justify-center px-3 py-2 rounded-lg border cursor-pointer transition-all
                  ${form.stockage === s ? 'bg-amber-500 text-white border-amber-500' : 'bg-white border-stone-300 hover:border-amber-400'}`}>
                  <input type="radio" name="stockage" value={s} checked={form.stockage === s} 
                    onChange={e => setForm({...form, stockage: e.target.value})} className="sr-only" />
                  <span className="text-sm">{s}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* PRIX & CONDITIONNEMENT */}
      <div className="bg-stone-50 rounded-xl p-4 space-y-4">
        <h3 className="font-semibold text-stone-700 flex items-center gap-2">
          <span className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm">3</span>
          Prix & Conditionnement
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1">Prix fournisseur (MUR) *</label>
            <input type="number" step="0.01" min="0" required value={form.prixFournisseur} 
              onChange={e => setForm({...form, prixFournisseur: parseFloat(e.target.value) || 0})}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1">Quantité par lot *</label>
            <input type="number" min="1" required value={form.lot} 
              onChange={e => setForm({...form, lot: parseInt(e.target.value) || 1})}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1">Prix unitaire</label>
            <div className="px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 font-medium">
              {formatMUR(prixUnitaire)}
            </div>
          </div>
        </div>
      </div>

      {/* TRANSFORMATION & EMBALLAGE */}
      <div className="bg-stone-50 rounded-xl p-4 space-y-4">
        <h3 className="font-semibold text-stone-700 flex items-center gap-2">
          <span className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm">4</span>
          Transformation & Emballage
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-2">Transformation OMC</label>
            <div className="space-y-2">
              {settings.transformationTypes.map(t => (
                <label key={t.id} className={`flex items-center justify-between px-3 py-2 rounded-lg border cursor-pointer transition-all
                  ${form.transformation === t.nom ? 'bg-amber-100 border-amber-400' : 'bg-white border-stone-200 hover:border-amber-300'}`}>
                  <div className="flex items-center gap-2">
                    <input type="radio" name="transformation" value={t.nom} checked={form.transformation === t.nom}
                      onChange={e => setForm({...form, transformation: e.target.value})} className="text-amber-500" />
                    <span className="text-sm">{t.label}</span>
                  </div>
                  <span className="text-sm text-stone-500">{t.cout > 0 ? `+${t.cout} MUR` : '-'}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-2">Type d'emballage</label>
            <div className="space-y-2">
              {settings.packingTypes.map(p => (
                <label key={p.id} className={`flex items-center justify-between px-3 py-2 rounded-lg border cursor-pointer transition-all
                  ${form.packingType === p.nom ? 'bg-amber-100 border-amber-400' : 'bg-white border-stone-200 hover:border-amber-300'}`}>
                  <div className="flex items-center gap-2">
                    <input type="radio" name="packing" value={p.nom} checked={form.packingType === p.nom}
                      onChange={e => setForm({...form, packingType: e.target.value})} className="text-amber-500" />
                    <span className="text-sm">{p.nom}</span>
                  </div>
                  <span className="text-sm text-stone-500">{p.cout > 0 ? `+${p.cout} MUR` : '-'}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* TVA & RÉCAP COÛTS */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 space-y-4 border border-amber-200">
        <h3 className="font-semibold text-stone-700 flex items-center gap-2">
          <span className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm">5</span>
          TVA & Récapitulatif des coûts
        </h3>
        <div className="flex items-center gap-4 mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.vatApplicable} onChange={e => setForm({...form, vatApplicable: e.target.checked})}
              className="w-4 h-4 text-amber-500 rounded" />
            <span className="text-sm text-stone-700">Soumis à la VAT ({settings.vatRate}%)</span>
          </label>
        </div>
        <div className="bg-white rounded-lg p-4 space-y-2 font-mono text-sm">
          <div className="flex justify-between"><span className="text-stone-600">Prix unitaire</span><span>{formatMUR(prixUnitaire)}</span></div>
          <div className="flex justify-between"><span className="text-stone-600">+ Transformation ({form.transformation})</span><span>+ {formatMUR(transfoCout)}</span></div>
          <div className="flex justify-between"><span className="text-stone-600">+ Emballage ({form.packingType})</span><span>+ {formatMUR(packingCout)}</span></div>
          {form.vatApplicable && <div className="flex justify-between"><span className="text-stone-600">+ VAT achat ({settings.vatRate}%)</span><span>+ {formatMUR(vatAchat)}</span></div>}
          <div className="border-t border-stone-200 pt-2 flex justify-between font-semibold text-amber-700">
            <span>= COÛT FINAL</span><span>{formatMUR(coutFinal)}</span>
          </div>
        </div>
      </div>

      {/* PRIX DE VENTE & MARGE */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 space-y-4 border border-emerald-200">
        <h3 className="font-semibold text-stone-700 flex items-center gap-2">
          <span className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm">6</span>
          Prix de vente & Marge
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1">Prix de vente TTC (MUR) *</label>
            <input type="number" step="0.01" min="0" required value={form.prixVente}
              onChange={e => setForm({...form, prixVente: parseFloat(e.target.value) || 0})}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-lg font-semibold" />
          </div>
          <div className="bg-white rounded-lg p-4 space-y-2">
            {form.vatApplicable && (
              <div className="flex justify-between text-sm">
                <span className="text-stone-600">VAT à reverser</span>
                <span className="text-red-600 font-medium">- {formatMUR(vatVente)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-stone-600">Marge brute</span>
              <span className={`font-semibold ${margeBrute >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{formatMUR(margeBrute)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-600">Marge %</span>
              <MargeIndicator margePct={margePct} seuilExcellent={settings.seuilMargeExcellente} seuilAcceptable={settings.seuilMargeAcceptable} />
            </div>
            {form.vatApplicable && (
              <div className="border-t border-stone-200 pt-2 flex justify-between">
                <span className="text-stone-600 font-medium">Marge nette (après VAT)</span>
                <span className={`font-bold ${margeNette >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>{formatMUR(margeNette)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* STATUT & NOTES */}
      <div className="bg-stone-50 rounded-xl p-4 space-y-4">
        <h3 className="font-semibold text-stone-700 flex items-center gap-2">
          <span className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm">7</span>
          Statut & Notes
        </h3>
        <label className="flex items-center gap-3 cursor-pointer p-3 bg-white rounded-lg border border-stone-200 hover:border-amber-400 transition-colors">
          <input type="checkbox" checked={form.selectionneOMC} onChange={e => setForm({...form, selectionneOMC: e.target.checked})}
            className="w-5 h-5 text-amber-500 rounded" />
          <div>
            <span className="font-medium text-stone-800">Sélectionné pour vente OMC</span>
            <p className="text-xs text-stone-500">Cocher si ce produit est actuellement vendu chez Oh My Cake</p>
          </div>
        </label>
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1">Notes / Commentaires</label>
          <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={2}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            placeholder="Informations complémentaires..." />
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
        <button type="button" onClick={onCancel}
          className="px-6 py-2 text-stone-600 hover:bg-stone-100 rounded-lg transition-colors">
          Annuler
        </button>
        <button type="submit"
          className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-amber-500/30">
          {isEdit ? 'Enregistrer les modifications' : 'Ajouter le produit'}
        </button>
      </div>
    </form>
  );
};

// === FORMULAIRE FOURNISSEUR ===
const FournisseurForm = ({ fournisseur, onSave, onCancel }) => {
  const isEdit = !!fournisseur?.id;
  const [form, setForm] = useState(fournisseur || {
    nom: '', adresse: '', contact: '', modeCommande: 'Telephone',
    livraison: true, typeLivraison: 'Delais', typeFournisseur: 'Impot', vat: true, notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...form, id: form.id || `f_${Date.now()}` });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-stone-600 mb-1">Nom du fournisseur *</label>
          <input type="text" required value={form.nom} onChange={e => setForm({...form, nom: e.target.value})}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500" />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-stone-600 mb-1">Adresse</label>
          <input type="text" value={form.adresse} onChange={e => setForm({...form, adresse: e.target.value})}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1">Contact</label>
          <input type="text" value={form.contact} onChange={e => setForm({...form, contact: e.target.value})}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            placeholder="Téléphone ou email" />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1">Mode de commande</label>
          <select value={form.modeCommande} onChange={e => setForm({...form, modeCommande: e.target.value})}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500">
            <option value="Telephone">Téléphone</option>
            <option value="Whatsapp">WhatsApp</option>
            <option value="Email">Email</option>
            <option value="Site">Site web</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1">Livraison</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input type="radio" name="livraison" checked={form.livraison} onChange={() => setForm({...form, livraison: true})} />
              <span>Oui</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="livraison" checked={!form.livraison} onChange={() => setForm({...form, livraison: false})} />
              <span>Non</span>
            </label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1">Type de livraison</label>
          <select value={form.typeLivraison} onChange={e => setForm({...form, typeLivraison: e.target.value})}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500">
            <option value="Delais">Délais (sur demande)</option>
            <option value="Jours Fix">Jours fixes</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1">Type de fournisseur</label>
          <select value={form.typeFournisseur} onChange={e => setForm({...form, typeFournisseur: e.target.value})}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500">
            <option value="Impot">Import</option>
            <option value="Production local">Production locale</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1">Soumis à la VAT</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input type="radio" name="vat" checked={form.vat} onChange={() => setForm({...form, vat: true})} />
              <span>Oui</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="vat" checked={!form.vat} onChange={() => setForm({...form, vat: false})} />
              <span>Non</span>
            </label>
          </div>
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-stone-600 mb-1">Notes</label>
          <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={2}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500" />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
        <button type="button" onClick={onCancel} className="px-6 py-2 text-stone-600 hover:bg-stone-100 rounded-lg">Annuler</button>
        <button type="submit" className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-lg shadow-lg">
          {isEdit ? 'Enregistrer' : 'Ajouter'}
        </button>
      </div>
    </form>
  );
};

// === POPUP DÉTAIL PRODUIT ===
const ProductDetail = ({ product, settings, products, onEdit, onClose }) => {
  const alternatives = products.filter(p => p.nomOMC === product.nomOMC && p.id !== product.id);
  const costs = calculateProductCosts(product, settings);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-bold text-stone-800">{product.nomOMC}</h3>
            {product.selectionneOMC && <Badge variant="success">✓ Sélectionné OMC</Badge>}
          </div>
          <p className="text-stone-500">Fournisseur: {product.fournisseur}</p>
        </div>
        <button onClick={() => onEdit(product)} className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
          Modifier
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-stone-50 rounded-xl p-4">
          <h4 className="font-semibold text-stone-700 mb-3">Informations</h4>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-stone-500">Nom fournisseur</dt><dd className="font-medium">{product.nomFournisseur}</dd></div>
            <div className="flex justify-between"><dt className="text-stone-500">Catégorie</dt><dd><Badge>{product.categorie}</Badge> <Badge variant="info">{product.sousCategorie}</Badge></dd></div>
            <div className="flex justify-between"><dt className="text-stone-500">Stockage</dt><dd><Badge variant="info">{product.stockage}</Badge></dd></div>
            <div className="flex justify-between"><dt className="text-stone-500">Transformation</dt><dd>{product.transformation !== 'aucune' ? <Badge variant="warning">{product.transformation}</Badge> : '-'}</dd></div>
            <div className="flex justify-between"><dt className="text-stone-500">Emballage</dt><dd>{product.packingType}</dd></div>
            <div className="flex justify-between"><dt className="text-stone-500">Lot</dt><dd>{product.lot} unité(s)</dd></div>
            <div className="flex justify-between"><dt className="text-stone-500">VAT applicable</dt><dd>{product.vatApplicable ? 'Oui' : 'Non'}</dd></div>
          </dl>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
          <h4 className="font-semibold text-stone-700 mb-3">Décomposition des coûts</h4>
          <dl className="space-y-2 text-sm font-mono">
            <div className="flex justify-between"><dt>Prix unitaire</dt><dd>{formatMUR(costs.prixUnitaire)}</dd></div>
            <div className="flex justify-between"><dt>+ Transformation</dt><dd>+ {formatMUR(costs.transfoCout)}</dd></div>
            <div className="flex justify-between"><dt>+ Emballage</dt><dd>+ {formatMUR(costs.packingCout)}</dd></div>
            {product.vatApplicable && <div className="flex justify-between"><dt>+ VAT achat ({settings.vatRate}%)</dt><dd>+ {formatMUR(costs.vatAchat)}</dd></div>}
            <div className="border-t border-amber-300 pt-2 flex justify-between font-bold text-amber-700"><dt>Coût final</dt><dd>{formatMUR(costs.coutFinal)}</dd></div>
            <div className="border-t border-amber-300 pt-2 flex justify-between"><dt>Prix de vente</dt><dd className="font-bold">{formatMUR(costs.prixVente)}</dd></div>
            {product.vatApplicable && <div className="flex justify-between text-red-600"><dt>VAT à reverser</dt><dd>- {formatMUR(costs.vatVente)}</dd></div>}
            <div className="flex justify-between"><dt>Marge brute</dt><dd className="font-bold text-emerald-600">{formatMUR(costs.margeBrute)}</dd></div>
            <div className="flex justify-between items-center"><dt>Marge %</dt><dd><MargeIndicator margePct={costs.margePct} seuilExcellent={settings.seuilMargeExcellente} seuilAcceptable={settings.seuilMargeAcceptable} /></dd></div>
            {product.vatApplicable && <div className="border-t border-amber-300 pt-2 flex justify-between font-bold"><dt>Marge nette</dt><dd className={costs.margeNette >= 0 ? 'text-emerald-700' : 'text-red-700'}>{formatMUR(costs.margeNette)}</dd></div>}
          </dl>
        </div>
      </div>

      {alternatives.length > 0 && (
        <div className="bg-sky-50 rounded-xl p-4 border border-sky-200">
          <h4 className="font-semibold text-stone-700 mb-3">Alternatives (même produit, autres fournisseurs)</h4>
          <table className="w-full text-sm">
            <thead><tr className="text-left text-stone-500"><th className="pb-2">Fournisseur</th><th>Coût final</th><th>Marge %</th><th>Statut</th></tr></thead>
            <tbody>
              {alternatives.map(alt => {
                const altCosts = calculateProductCosts(alt, settings);
                return (
                <tr key={alt.id} className="border-t border-sky-200">
                  <td className="py-2 font-medium">{alt.fournisseur}</td>
                  <td>{formatMUR(altCosts.coutFinal)}</td>
                  <td><MargeIndicator margePct={altCosts.margePct} seuilExcellent={settings.seuilMargeExcellente} seuilAcceptable={settings.seuilMargeAcceptable} /></td>
                  <td>{alt.selectionneOMC ? <Badge variant="success">Sélectionné</Badge> : <Badge>Alternative</Badge>}</td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {product.notes && (
        <div className="bg-stone-100 rounded-xl p-4">
          <h4 className="font-semibold text-stone-700 mb-2">Notes</h4>
          <p className="text-stone-600">{product.notes}</p>
        </div>
      )}
    </div>
  );
};

// === PAGE CATALOGUE ===
const CataloguePage = ({ products, setProducts, settings, fournisseurs }) => {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ categorie: '', fournisseur: '', stockage: '', statut: '' });
  const [sortBy, setSortBy] = useState('nomOMC');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(null);
  const [editProduct, setEditProduct] = useState(null);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(p => p.nomOMC.toLowerCase().includes(s) || p.nomFournisseur.toLowerCase().includes(s) || p.fournisseur.toLowerCase().includes(s));
    }
    if (filters.categorie) result = result.filter(p => p.categorie === filters.categorie);
    if (filters.fournisseur) result = result.filter(p => p.fournisseur === filters.fournisseur);
    if (filters.stockage) result = result.filter(p => p.stockage === filters.stockage);
    if (filters.statut === 'selectionne') result = result.filter(p => p.selectionneOMC);
    if (filters.statut === 'non_selectionne') result = result.filter(p => !p.selectionneOMC);
    
    result.sort((a, b) => {
      let valA = a[sortBy] ?? '';
      let valB = b[sortBy] ?? '';
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    return result;
  }, [products, search, filters, sortBy, sortOrder]);

  const toggleSelection = (id) => {
    setProducts(products.map(p => p.id === id ? {...p, selectionneOMC: !p.selectionneOMC} : p));
  };

  const handleSaveProduct = (product) => {
    if (editProduct) {
      setProducts(products.map(p => p.id === product.id ? product : p));
    } else {
      setProducts([...products, product]);
    }
    setShowAddModal(false);
    setEditProduct(null);
  };

  const handleSort = (field) => {
    if (sortBy === field) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setSortOrder('asc'); }
  };

  const uniqueFournisseurs = [...new Set(products.map(p => p.fournisseur))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Catalogue Produits</h1>
          <p className="text-stone-500">{filteredProducts.length} produit(s) • {products.filter(p => p.selectionneOMC).length} sélectionné(s) OMC</p>
        </div>
        <button onClick={() => { setEditProduct(null); setShowAddModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-lg shadow-lg shadow-amber-500/30 hover:shadow-xl transition-all">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Ajouter un produit
        </button>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-stone-500 mb-1">Recherche</label>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              placeholder="🔍 Nom OMC, fournisseur..." />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1">Catégorie</label>
            <select value={filters.categorie} onChange={e => setFilters({...filters, categorie: e.target.value})}
              className="px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500">
              <option value="">Toutes</option>
              {settings.categories.map(c => <option key={c.id} value={c.nom}>{c.nom}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1">Fournisseur</label>
            <select value={filters.fournisseur} onChange={e => setFilters({...filters, fournisseur: e.target.value})}
              className="px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500">
              <option value="">Tous</option>
              {uniqueFournisseurs.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1">Stockage</label>
            <select value={filters.stockage} onChange={e => setFilters({...filters, stockage: e.target.value})}
              className="px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500">
              <option value="">Tous</option>
              {settings.stockageTypes.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1">Statut OMC</label>
            <select value={filters.statut} onChange={e => setFilters({...filters, statut: e.target.value})}
              className="px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500">
              <option value="">Tous</option>
              <option value="selectionne">Sélectionné</option>
              <option value="non_selectionne">Non sélectionné</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gradient-to-r from-stone-100 to-stone-50">
              <tr>
                <th className="px-4 py-3 text-left w-12">OMC</th>
                <th className="px-4 py-3 text-left cursor-pointer hover:bg-stone-200" onClick={() => handleSort('nomOMC')}>
                  Nom OMC {sortBy === 'nomOMC' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-4 py-3 text-left">Nom Fournisseur</th>
                <th className="px-4 py-3 text-left cursor-pointer hover:bg-stone-200" onClick={() => handleSort('fournisseur')}>
                  Fournisseur {sortBy === 'fournisseur' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-4 py-3 text-left">Catégorie</th>
                <th className="px-4 py-3 text-left">Stockage</th>
                <th className="px-4 py-3 text-right cursor-pointer hover:bg-stone-200" onClick={() => handleSort('coutFinal')}>
                  Coût {sortBy === 'coutFinal' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-4 py-3 text-right cursor-pointer hover:bg-stone-200" onClick={() => handleSort('prixVente')}>
                  Prix vente {sortBy === 'prixVente' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-4 py-3 text-right cursor-pointer hover:bg-stone-200" onClick={() => handleSort('margePct')}>
                  Marge {sortBy === 'margePct' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, idx) => {
                const costs = calculateProductCosts(product, settings);
                return (
                <tr key={product.id} className={`border-t border-stone-100 hover:bg-amber-50/50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-stone-50/50'}`}>
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={product.selectionneOMC} onChange={() => toggleSelection(product.id)}
                      className="w-5 h-5 text-amber-500 rounded border-stone-300 cursor-pointer" />
                  </td>
                  <td className="px-4 py-3 font-medium text-stone-800">{product.nomOMC}</td>
                  <td className="px-4 py-3 text-stone-600">{product.nomFournisseur}</td>
                  <td className="px-4 py-3"><Badge>{product.fournisseur}</Badge></td>
                  <td className="px-4 py-3"><Badge variant="info">{product.categorie}</Badge></td>
                  <td className="px-4 py-3"><Badge variant={product.stockage === 'Freeze' ? 'info' : product.stockage === 'Frais' ? 'success' : 'default'}>{product.stockage}</Badge></td>
                  <td className="px-4 py-3 text-right font-mono">{formatMUR(costs.coutFinal)}</td>
                  <td className="px-4 py-3 text-right font-mono font-semibold">{formatMUR(costs.prixVente)}</td>
                  <td className="px-4 py-3 text-right">
                    <MargeIndicator margePct={costs.margePct} 
                      seuilExcellent={settings.seuilMargeExcellente} seuilAcceptable={settings.seuilMargeAcceptable} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-1">
                      <button onClick={() => setShowDetailModal(product)} className="p-2 text-stone-500 hover:text-amber-600 hover:bg-amber-100 rounded-lg" title="Détail">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      </button>
                      <button onClick={() => { setEditProduct(product); setShowAddModal(true); }} className="p-2 text-stone-500 hover:text-amber-600 hover:bg-amber-100 rounded-lg" title="Modifier">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-stone-500">
            <p>Aucun produit trouvé</p>
          </div>
        )}
      </div>

      {/* Modal Ajout/Edit */}
      <Modal isOpen={showAddModal} onClose={() => { setShowAddModal(false); setEditProduct(null); }} 
        title={editProduct ? 'Modifier le produit' : 'Ajouter un produit'} size="lg">
        <ProductForm product={editProduct} onSave={handleSaveProduct} onCancel={() => { setShowAddModal(false); setEditProduct(null); }}
          settings={settings} fournisseurs={fournisseurs} />
      </Modal>

      {/* Modal Détail */}
      <Modal isOpen={!!showDetailModal} onClose={() => setShowDetailModal(null)} title="Détail du produit" size="lg">
        {showDetailModal && <ProductDetail product={showDetailModal} settings={settings} products={products}
          onEdit={(p) => { setShowDetailModal(null); setEditProduct(p); setShowAddModal(true); }} onClose={() => setShowDetailModal(null)} />}
      </Modal>
    </div>
  );
};

// === PAGE FOURNISSEURS ===
const FournisseursPage = ({ fournisseurs, setFournisseurs, products }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editFournisseur, setEditFournisseur] = useState(null);

  const handleSave = (fournisseur) => {
    if (editFournisseur) {
      setFournisseurs(fournisseurs.map(f => f.id === fournisseur.id ? fournisseur : f));
    } else {
      setFournisseurs([...fournisseurs, fournisseur]);
    }
    setShowAddModal(false);
    setEditFournisseur(null);
  };

  const getProductCount = (nom) => products.filter(p => p.fournisseur === nom).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Fournisseurs</h1>
          <p className="text-stone-500">{fournisseurs.length} fournisseur(s)</p>
        </div>
        <button onClick={() => { setEditFournisseur(null); setShowAddModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-lg shadow-lg">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Ajouter un fournisseur
        </button>
      </div>

      <div className="grid gap-4">
        {fournisseurs.map(f => (
          <div key={f.id} className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-stone-800">{f.nom}</h3>
                  <Badge variant="info">{getProductCount(f.nom)} produits</Badge>
                  {f.vat && <Badge variant="warning">VAT</Badge>}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-stone-500">Mode commande:</span>
                    <p className="font-medium">{f.modeCommande}</p>
                  </div>
                  <div>
                    <span className="text-stone-500">Livraison:</span>
                    <p className="font-medium">{f.livraison ? `Oui (${f.typeLivraison})` : 'Non'}</p>
                  </div>
                  <div>
                    <span className="text-stone-500">Type:</span>
                    <p className="font-medium">{f.typeFournisseur}</p>
                  </div>
                  {f.contact && (
                    <div>
                      <span className="text-stone-500">Contact:</span>
                      <p className="font-medium">{f.contact}</p>
                    </div>
                  )}
                </div>
                {f.notes && <p className="mt-2 text-sm text-stone-500 italic">{f.notes}</p>}
              </div>
              <button onClick={() => { setEditFournisseur(f); setShowAddModal(true); }}
                className="p-2 text-stone-500 hover:text-amber-600 hover:bg-amber-100 rounded-lg">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={showAddModal} onClose={() => { setShowAddModal(false); setEditFournisseur(null); }}
        title={editFournisseur ? 'Modifier le fournisseur' : 'Ajouter un fournisseur'} size="md">
        <FournisseurForm fournisseur={editFournisseur} onSave={handleSave} onCancel={() => { setShowAddModal(false); setEditFournisseur(null); }} />
      </Modal>
    </div>
  );
};

// === PAGE PARAMÈTRES ===
const SettingsPage = ({ settings, setSettings }) => {
  const [editPacking, setEditPacking] = useState(null);
  const [editTransfo, setEditTransfo] = useState(null);

  const updatePacking = (id, field, value) => {
    setSettings({
      ...settings,
      packingTypes: settings.packingTypes.map(p => p.id === id ? {...p, [field]: value} : p)
    });
  };

  const updateTransfo = (id, field, value) => {
    setSettings({
      ...settings,
      transformationTypes: settings.transformationTypes.map(t => t.id === id ? {...t, [field]: value} : t)
    });
  };

  const addPacking = () => {
    const newPacking = { id: `p_${Date.now()}`, nom: 'Nouveau', cout: 0, description: '' };
    setSettings({ ...settings, packingTypes: [...settings.packingTypes, newPacking] });
  };

  const addTransfo = () => {
    const newTransfo = { id: `t_${Date.now()}`, nom: `transfo_${Date.now()}`, label: 'Nouveau', cout: 0, description: '' };
    setSettings({ ...settings, transformationTypes: [...settings.transformationTypes, newTransfo] });
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-stone-800">Paramètres</h1>

      {/* VAT */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
        <h2 className="text-lg font-semibold text-stone-800 mb-4">Taxe sur la valeur ajoutée (VAT)</h2>
        <div className="flex items-center gap-4">
          <label className="text-stone-600">Taux VAT standard:</label>
          <input type="number" value={settings.vatRate} onChange={e => setSettings({...settings, vatRate: parseFloat(e.target.value) || 0})}
            className="w-24 px-3 py-2 border border-stone-300 rounded-lg text-center font-semibold" />
          <span className="text-stone-500">%</span>
        </div>
      </div>

      {/* Emballage */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-stone-800">Types d'emballage (Packing)</h2>
          <button onClick={addPacking} className="flex items-center gap-1 px-3 py-1 text-amber-600 hover:bg-amber-50 rounded-lg">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Ajouter
          </button>
        </div>
        <table className="w-full text-sm">
          <thead><tr className="text-left text-stone-500 border-b"><th className="pb-2">Type</th><th className="pb-2">Coût (MUR)</th><th className="pb-2">Description</th><th></th></tr></thead>
          <tbody>
            {settings.packingTypes.map(p => (
              <tr key={p.id} className="border-b border-stone-100">
                <td className="py-2">
                  <input type="text" value={p.nom} onChange={e => updatePacking(p.id, 'nom', e.target.value)}
                    className="px-2 py-1 border border-stone-200 rounded w-full" />
                </td>
                <td className="py-2">
                  <input type="number" step="0.5" value={p.cout} onChange={e => updatePacking(p.id, 'cout', parseFloat(e.target.value) || 0)}
                    className="px-2 py-1 border border-stone-200 rounded w-24" />
                </td>
                <td className="py-2">
                  <input type="text" value={p.description} onChange={e => updatePacking(p.id, 'description', e.target.value)}
                    className="px-2 py-1 border border-stone-200 rounded w-full" />
                </td>
                <td className="py-2 text-right">
                  <button onClick={() => setSettings({...settings, packingTypes: settings.packingTypes.filter(x => x.id !== p.id)})}
                    className="p-1 text-red-500 hover:bg-red-50 rounded">🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Transformation */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-stone-800">Types de transformation OMC</h2>
          <button onClick={addTransfo} className="flex items-center gap-1 px-3 py-1 text-amber-600 hover:bg-amber-50 rounded-lg">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Ajouter
          </button>
        </div>
        <table className="w-full text-sm">
          <thead><tr className="text-left text-stone-500 border-b"><th className="pb-2">Label</th><th className="pb-2">Coût (MUR)</th><th className="pb-2">Description</th><th></th></tr></thead>
          <tbody>
            {settings.transformationTypes.map(t => (
              <tr key={t.id} className="border-b border-stone-100">
                <td className="py-2">
                  <input type="text" value={t.label} onChange={e => updateTransfo(t.id, 'label', e.target.value)}
                    className="px-2 py-1 border border-stone-200 rounded w-full" />
                </td>
                <td className="py-2">
                  <input type="number" step="0.5" value={t.cout} onChange={e => updateTransfo(t.id, 'cout', parseFloat(e.target.value) || 0)}
                    className="px-2 py-1 border border-stone-200 rounded w-24" />
                </td>
                <td className="py-2">
                  <input type="text" value={t.description} onChange={e => updateTransfo(t.id, 'description', e.target.value)}
                    className="px-2 py-1 border border-stone-200 rounded w-full" />
                </td>
                <td className="py-2 text-right">
                  <button onClick={() => setSettings({...settings, transformationTypes: settings.transformationTypes.filter(x => x.id !== t.id)})}
                    className="p-1 text-red-500 hover:bg-red-50 rounded">🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Seuils marge */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
        <h2 className="text-lg font-semibold text-stone-800 mb-4">Seuils d'alerte marge</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex items-center gap-4">
            <span className="text-2xl">🟢</span>
            <label className="text-stone-600">Marge excellente ≥</label>
            <input type="number" value={settings.seuilMargeExcellente} onChange={e => setSettings({...settings, seuilMargeExcellente: parseFloat(e.target.value) || 0})}
              className="w-20 px-3 py-2 border border-stone-300 rounded-lg text-center" />
            <span>%</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-2xl">🟡</span>
            <label className="text-stone-600">Marge acceptable ≥</label>
            <input type="number" value={settings.seuilMargeAcceptable} onChange={e => setSettings({...settings, seuilMargeAcceptable: parseFloat(e.target.value) || 0})}
              className="w-20 px-3 py-2 border border-stone-300 rounded-lg text-center" />
            <span>%</span>
          </div>
        </div>
        <p className="mt-4 text-sm text-stone-500">🔴 Les marges inférieures à {settings.seuilMargeAcceptable}% seront affichées en rouge (critique)</p>
      </div>

      {/* Catégories de produits */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-stone-800">Catégories de produits</h2>
          <button onClick={() => {
            const newCat = { id: `c_${Date.now()}`, nom: 'Nouvelle catégorie', sousCategories: ['Autre'] };
            setSettings({ ...settings, categories: [...settings.categories, newCat] });
          }} className="flex items-center gap-1 px-3 py-1 text-amber-600 hover:bg-amber-50 rounded-lg">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Ajouter catégorie
          </button>
        </div>
        
        <div className="space-y-4">
          {settings.categories.map((cat, catIndex) => (
            <div key={cat.id} className="border border-stone-200 rounded-lg p-4 bg-stone-50">
              <div className="flex items-center gap-3 mb-3">
                <input 
                  type="text" 
                  value={cat.nom} 
                  onChange={e => {
                    const updated = settings.categories.map(c => c.id === cat.id ? {...c, nom: e.target.value} : c);
                    setSettings({...settings, categories: updated});
                  }}
                  className="px-3 py-2 border border-stone-300 rounded-lg font-semibold text-stone-800 bg-white"
                />
                <button 
                  onClick={() => {
                    if (confirm(`Supprimer la catégorie "${cat.nom}" et toutes ses sous-catégories ?`)) {
                      setSettings({...settings, categories: settings.categories.filter(c => c.id !== cat.id)});
                    }
                  }}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  title="Supprimer la catégorie"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
              
              <div className="ml-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-stone-500">Sous-catégories:</span>
                  <button 
                    onClick={() => {
                      const updated = settings.categories.map(c => {
                        if (c.id === cat.id) {
                          return {...c, sousCategories: [...c.sousCategories, 'Nouvelle']};
                        }
                        return c;
                      });
                      setSettings({...settings, categories: updated});
                    }}
                    className="text-xs px-2 py-1 text-amber-600 hover:bg-amber-100 rounded"
                  >
                    + Ajouter
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {cat.sousCategories.map((sousCat, sousIndex) => (
                    <div key={sousIndex} className="flex items-center gap-1 bg-white border border-stone-200 rounded-lg px-2 py-1">
                      <input
                        type="text"
                        value={sousCat}
                        onChange={e => {
                          const updated = settings.categories.map(c => {
                            if (c.id === cat.id) {
                              const newSousCats = [...c.sousCategories];
                              newSousCats[sousIndex] = e.target.value;
                              return {...c, sousCategories: newSousCats};
                            }
                            return c;
                          });
                          setSettings({...settings, categories: updated});
                        }}
                        className="w-24 text-sm border-none bg-transparent focus:outline-none focus:ring-0"
                      />
                      {cat.sousCategories.length > 1 && (
                        <button
                          onClick={() => {
                            const updated = settings.categories.map(c => {
                              if (c.id === cat.id) {
                                return {...c, sousCategories: c.sousCategories.filter((_, i) => i !== sousIndex)};
                              }
                              return c;
                            });
                            setSettings({...settings, categories: updated});
                          }}
                          className="text-red-400 hover:text-red-600"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Types de stockage */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-stone-800">Types de stockage</h2>
          <button onClick={() => {
            const newType = prompt('Nom du nouveau type de stockage:');
            if (newType && newType.trim()) {
              setSettings({ ...settings, stockageTypes: [...settings.stockageTypes, newType.trim()] });
            }
          }} className="flex items-center gap-1 px-3 py-1 text-amber-600 hover:bg-amber-50 rounded-lg">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Ajouter
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {settings.stockageTypes.map((type, index) => (
            <div key={index} className="flex items-center gap-2 bg-stone-100 rounded-lg px-3 py-2">
              <span className="text-stone-700">{type}</span>
              {settings.stockageTypes.length > 1 && (
                <button
                  onClick={() => setSettings({...settings, stockageTypes: settings.stockageTypes.filter((_, i) => i !== index)})}
                  className="text-red-400 hover:text-red-600"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// === PAGE DASHBOARD ===
const DashboardPage = ({ products, fournisseurs, settings }) => {
  const selectedProducts = products.filter(p => p.selectionneOMC);
  
  // Calculer les coûts pour chaque produit sélectionné
  const selectedWithCosts = selectedProducts.map(p => ({
    ...p,
    costs: calculateProductCosts(p, settings)
  }));
  
  const avgMarge = selectedWithCosts.length > 0 
    ? selectedWithCosts.reduce((sum, p) => sum + p.costs.margePct, 0) / selectedWithCosts.length 
    : 0;
  const avgMargeMUR = selectedWithCosts.length > 0
    ? selectedWithCosts.reduce((sum, p) => sum + p.costs.margeBrute, 0) / selectedWithCosts.length
    : 0;

  const byCategory = settings.categories.map(c => {
    const catProducts = selectedWithCosts.filter(p => p.categorie === c.nom);
    return {
      nom: c.nom,
      count: catProducts.length,
      marge: catProducts.length > 0 ? catProducts.reduce((s, p) => s + p.costs.margePct, 0) / catProducts.length : 0
    };
  });

  const topMargin = [...selectedWithCosts]
    .sort((a, b) => b.costs.margeBrute - a.costs.margeBrute)
    .slice(0, 5);

  const lowMargin = [...selectedWithCosts]
    .filter(p => p.costs.margePct < settings.seuilMargeAcceptable / 100)
    .sort((a, b) => a.costs.margePct - b.costs.margePct)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-stone-800">Dashboard</h1>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl p-6 text-white">
          <p className="text-amber-100 text-sm">Fournisseurs</p>
          <p className="text-4xl font-bold">{fournisseurs.length}</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl p-6 text-white">
          <p className="text-emerald-100 text-sm">Produits sélectionnés</p>
          <p className="text-4xl font-bold">{selectedProducts.length}</p>
          <p className="text-emerald-200 text-xs">sur {products.length} total</p>
        </div>
        <div className="bg-gradient-to-br from-sky-500 to-blue-500 rounded-xl p-6 text-white">
          <p className="text-sky-100 text-sm">Marge moyenne</p>
          <p className="text-4xl font-bold">{(avgMarge * 100).toFixed(1)}%</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl p-6 text-white">
          <p className="text-purple-100 text-sm">Marge moy. / produit</p>
          <p className="text-4xl font-bold">{avgMargeMUR.toFixed(0)}</p>
          <p className="text-purple-200 text-xs">MUR</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
          <h3 className="font-semibold text-stone-800 mb-4">Par catégorie</h3>
          <div className="space-y-3">
            {byCategory.map(c => (
              <div key={c.nom} className="flex items-center gap-4">
                <span className="w-24 text-sm text-stone-600">{c.nom}</span>
                <div className="flex-1 bg-stone-100 rounded-full h-6 overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-400 to-orange-400 h-full rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${Math.max(10, c.count / selectedProducts.length * 100)}%` }}>
                    <span className="text-xs text-white font-medium">{c.count}</span>
                  </div>
                </div>
                <span className="text-sm text-stone-500">{(c.marge * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
          <h3 className="font-semibold text-stone-800 mb-4">🏆 Top 5 marge (MUR)</h3>
          <div className="space-y-2">
            {topMargin.map((p, i) => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-sm font-bold">{i + 1}</span>
                  <span className="font-medium">{p.nomOMC}</span>
                </div>
                <span className="text-emerald-600 font-semibold">{formatMUR(p.costs.margeBrute)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alertes */}
      {lowMargin.length > 0 && (
        <div className="bg-red-50 rounded-xl border border-red-200 p-6">
          <h3 className="font-semibold text-red-800 mb-4">⚠️ Produits avec marge critique (&lt; {settings.seuilMargeAcceptable}%)</h3>
          <div className="grid grid-cols-2 gap-4">
            {lowMargin.map(p => (
              <div key={p.id} className="flex items-center justify-between bg-white rounded-lg p-3 border border-red-200">
                <span className="font-medium text-stone-800">{p.nomOMC}</span>
                <Badge variant="danger">{(p.costs.margePct * 100).toFixed(1)}%</Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// === APP PRINCIPALE ===
export default function OMCManager() {
  const [page, setPage] = useState('dashboard');
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('omc_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });
  const [fournisseurs, setFournisseurs] = useState(() => {
    const saved = localStorage.getItem('omc_fournisseurs');
    return saved ? JSON.parse(saved) : INITIAL_FOURNISSEURS;
  });
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('omc_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  useEffect(() => { localStorage.setItem('omc_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('omc_fournisseurs', JSON.stringify(fournisseurs)); }, [fournisseurs]);
  useEffect(() => { localStorage.setItem('omc_settings', JSON.stringify(settings)); }, [settings]);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'catalogue', label: 'Catalogue', icon: '🛒' },
    { id: 'fournisseurs', label: 'Fournisseurs', icon: '🏭' },
    { id: 'parametres', label: 'Paramètres', icon: '⚙️' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 via-amber-50/30 to-orange-50/30">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-600 via-orange-500 to-amber-500 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🍰</span>
              <div>
                <h1 className="text-xl font-bold">Oh My Cake</h1>
                <p className="text-amber-100 text-xs">Gestion Produits & Fournisseurs</p>
              </div>
            </div>
            <nav className="flex gap-1">
              {navItems.map(item => (
                <button key={item.id} onClick={() => setPage(item.id)}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                    page === item.id 
                      ? 'bg-white/20 text-white font-medium' 
                      : 'text-amber-100 hover:bg-white/10'
                  }`}>
                  <span>{item.icon}</span>
                  <span className="hidden md:inline">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {page === 'dashboard' && <DashboardPage products={products} fournisseurs={fournisseurs} settings={settings} />}
        {page === 'catalogue' && <CataloguePage products={products} setProducts={setProducts} settings={settings} fournisseurs={fournisseurs} />}
        {page === 'fournisseurs' && <FournisseursPage fournisseurs={fournisseurs} setFournisseurs={setFournisseurs} products={products} />}
        {page === 'parametres' && <SettingsPage settings={settings} setSettings={setSettings} />}
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-stone-400 text-sm">
        OMC Manager v1.0 • Données sauvegardées localement
      </footer>
    </div>
  );
}
