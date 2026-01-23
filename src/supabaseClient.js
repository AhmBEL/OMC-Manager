// Configuration Supabase pour OMC Manager
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vswtnkruqmsthogxxmsp.supabase.co';
const supabaseAnonKey = 'sb_publishable__vKxNcvUZ-Jkg0hy9u1gaQ_TVtUMHpY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// === FONCTIONS UTILITAIRES POUR LA BASE DE DONNÉES ===

// --- PRODUITS ---
export const fetchProduits = async () => {
  const { data, error } = await supabase
    .from('produits')
    .select('*')
    .order('created_at', { ascending: true });
  
  if (error) {
    console.error('Erreur fetch produits:', error);
    return [];
  }
  
  // Convertir les noms de colonnes snake_case vers camelCase
  return data.map(p => ({
    id: p.id,
    nomOMC: p.nom_omc,
    nomFournisseur: p.nom_fournisseur,
    categorie: p.categorie,
    sousCategorie: p.sous_categorie,
    fournisseur: p.fournisseur,
    stockage: p.stockage,
    cuisson: p.cuisson,
    prixFournisseur: Number(p.prix_fournisseur),
    lot: p.lot,
    prixUnitaire: Number(p.prix_unitaire),
    packingType: p.packing_type,
    packing: Number(p.packing),
    transformation: p.transformation,
    coutTransformation: Number(p.cout_transformation),
    vatApplicable: p.vat_applicable,
    prixVente: Number(p.prix_vente),
    selectionneOMC: p.selectionne_omc,
    notes: p.notes,
    loyverseId: p.loyverse_id
  }));
};

export const saveProduit = async (produit) => {
  const { data, error } = await supabase
    .from('produits')
    .upsert({
      id: produit.id,
      nom_omc: produit.nomOMC,
      nom_fournisseur: produit.nomFournisseur,
      categorie: produit.categorie,
      sous_categorie: produit.sousCategorie,
      fournisseur: produit.fournisseur,
      stockage: produit.stockage,
      cuisson: produit.cuisson,
      prix_fournisseur: produit.prixFournisseur,
      lot: produit.lot,
      prix_unitaire: produit.prixUnitaire,
      packing_type: produit.packingType,
      packing: produit.packing,
      transformation: produit.transformation,
      cout_transformation: produit.coutTransformation,
      vat_applicable: produit.vatApplicable,
      prix_vente: produit.prixVente,
      selectionne_omc: produit.selectionneOMC,
      notes: produit.notes,
      loyverse_id: produit.loyverseId,
      updated_at: new Date().toISOString()
    }, { onConflict: 'id' });
  
  if (error) console.error('Erreur save produit:', error);
  return { data, error };
};

export const deleteProduit = async (id) => {
  const { error } = await supabase
    .from('produits')
    .delete()
    .eq('id', id);
  
  if (error) console.error('Erreur delete produit:', error);
  return { error };
};

// --- FOURNISSEURS ---
export const fetchFournisseurs = async () => {
  const { data, error } = await supabase
    .from('fournisseurs')
    .select('*')
    .order('created_at', { ascending: true });
  
  if (error) {
    console.error('Erreur fetch fournisseurs:', error);
    return [];
  }
  
  return data.map(f => ({
    id: f.id,
    nom: f.nom,
    adresse: f.adresse,
    contact: f.contact,
    modeCommande: f.mode_commande,
    livraison: f.livraison,
    typeLivraison: f.type_livraison,
    typeFournisseur: f.type_fournisseur,
    vat: f.vat,
    notes: f.notes
  }));
};

export const saveFournisseur = async (fournisseur) => {
  const { data, error } = await supabase
    .from('fournisseurs')
    .upsert({
      id: fournisseur.id,
      nom: fournisseur.nom,
      adresse: fournisseur.adresse,
      contact: fournisseur.contact,
      mode_commande: fournisseur.modeCommande,
      livraison: fournisseur.livraison,
      type_livraison: fournisseur.typeLivraison,
      type_fournisseur: fournisseur.typeFournisseur,
      vat: fournisseur.vat,
      notes: fournisseur.notes,
      updated_at: new Date().toISOString()
    }, { onConflict: 'id' });
  
  if (error) console.error('Erreur save fournisseur:', error);
  return { data, error };
};

export const deleteFournisseur = async (id) => {
  const { error } = await supabase
    .from('fournisseurs')
    .delete()
    .eq('id', id);
  
  if (error) console.error('Erreur delete fournisseur:', error);
  return { error };
};

// --- ASSEMBLAGES ---
export const fetchAssemblages = async () => {
  const { data, error } = await supabase
    .from('assemblages')
    .select('*')
    .order('created_at', { ascending: true });
  
  if (error) {
    console.error('Erreur fetch assemblages:', error);
    return [];
  }
  
  return data.map(a => ({
    id: a.id,
    nom: a.nom,
    description: a.description,
    composants: a.composants || [],
    coutAssemblage: Number(a.cout_assemblage),
    packingType: a.packing_type,
    vatApplicable: a.vat_applicable,
    prixVente: Number(a.prix_vente),
    actif: a.actif,
    coutComposants: Number(a.cout_composants),
    coutFinal: Number(a.cout_final),
    margePct: Number(a.marge_pct),
    notes: a.notes,
    isAssemblage: true,
    loyverseId: a.loyverse_id
  }));
};

export const saveAssemblage = async (assemblage) => {
  const { data, error } = await supabase
    .from('assemblages')
    .upsert({
      id: assemblage.id,
      nom: assemblage.nom,
      description: assemblage.description,
      composants: assemblage.composants,
      cout_assemblage: assemblage.coutAssemblage,
      packing_type: assemblage.packingType,
      vat_applicable: assemblage.vatApplicable,
      prix_vente: assemblage.prixVente,
      actif: assemblage.actif,
      cout_composants: assemblage.coutComposants,
      cout_final: assemblage.coutFinal,
      marge_pct: assemblage.margePct,
      notes: assemblage.notes,
      loyverse_id: assemblage.loyverseId,
      updated_at: new Date().toISOString()
    }, { onConflict: 'id' });
  
  if (error) console.error('Erreur save assemblage:', error);
  return { data, error };
};

export const deleteAssemblage = async (id) => {
  const { error } = await supabase
    .from('assemblages')
    .delete()
    .eq('id', id);
  
  if (error) console.error('Erreur delete assemblage:', error);
  return { error };
};

// --- SETTINGS ---
export const fetchSettings = async () => {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('id', 'main')
    .single();
  
  if (error && error.code !== 'PGRST116') {
    console.error('Erreur fetch settings:', error);
    return null;
  }
  
  if (!data) return null;
  
  return {
    vatRate: Number(data.vat_rate),
    packingTypes: data.packing_types || [],
    transformationTypes: data.transformation_types || [],
    categories: data.categories || [],
    stockageTypes: data.stockage_types || ['Freeze', 'Frais', 'Sec'],
    seuilMargeExcellente: Number(data.seuil_marge_excellente),
    seuilMargeAcceptable: Number(data.seuil_marge_acceptable),
    coefficientPrixConseille: Number(data.coefficient_prix_conseille)
  };
};

export const saveSettings = async (settings) => {
  const { data, error } = await supabase
    .from('settings')
    .upsert({
      id: 'main',
      vat_rate: settings.vatRate,
      packing_types: settings.packingTypes,
      transformation_types: settings.transformationTypes,
      categories: settings.categories,
      stockage_types: settings.stockageTypes,
      seuil_marge_excellente: settings.seuilMargeExcellente,
      seuil_marge_acceptable: settings.seuilMargeAcceptable,
      coefficient_prix_conseille: settings.coefficientPrixConseille,
      updated_at: new Date().toISOString()
    }, { onConflict: 'id' });
  
  if (error) console.error('Erreur save settings:', error);
  return { data, error };
};

// --- VENTES (pour sync Loyverse) ---
export const fetchVentes = async (startDate, endDate) => {
  let query = supabase
    .from('ventes')
    .select('*')
    .order('date_vente', { ascending: false });
  
  if (startDate) {
    query = query.gte('date_vente', startDate);
  }
  if (endDate) {
    query = query.lte('date_vente', endDate);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Erreur fetch ventes:', error);
    return [];
  }
  
  return data.map(v => ({
    id: v.id,
    receiptNumber: v.receipt_number,
    dateVente: v.date_vente,
    produitId: v.produit_id,
    produitNom: v.produit_nom,
    quantite: Number(v.quantite),
    prixUnitaire: Number(v.prix_unitaire),
    total: Number(v.total),
    heure: v.heure,
    jourSemaine: v.jour_semaine
  }));
};

export const saveVente = async (vente) => {
  const { data, error } = await supabase
    .from('ventes')
    .upsert({
      id: vente.id,
      receipt_number: vente.receiptNumber,
      date_vente: vente.dateVente,
      produit_id: vente.produitId,
      produit_nom: vente.produitNom,
      quantite: vente.quantite,
      prix_unitaire: vente.prixUnitaire,
      total: vente.total,
      heure: vente.heure,
      jour_semaine: vente.jourSemaine
    }, { onConflict: 'id' });
  
  if (error) console.error('Erreur save vente:', error);
  return { data, error };
};

// --- MIGRATION DEPUIS LOCALSTORAGE ---
export const migrateFromLocalStorage = async () => {
  const results = {
    produits: { success: 0, error: 0 },
    fournisseurs: { success: 0, error: 0 },
    assemblages: { success: 0, error: 0 },
    settings: { success: false, error: null }
  };

  // Migrer les produits
  const localProducts = JSON.parse(localStorage.getItem('omc_products') || '[]');
  for (const product of localProducts) {
    const { error } = await saveProduit(product);
    if (error) results.produits.error++;
    else results.produits.success++;
  }

  // Migrer les fournisseurs
  const localFournisseurs = JSON.parse(localStorage.getItem('omc_fournisseurs') || '[]');
  for (const fournisseur of localFournisseurs) {
    const { error } = await saveFournisseur(fournisseur);
    if (error) results.fournisseurs.error++;
    else results.fournisseurs.success++;
  }

  // Migrer les assemblages
  const localAssemblages = JSON.parse(localStorage.getItem('omc_assemblages') || '[]');
  for (const assemblage of localAssemblages) {
    const { error } = await saveAssemblage(assemblage);
    if (error) results.assemblages.error++;
    else results.assemblages.success++;
  }

  // Migrer les settings
  const localSettings = JSON.parse(localStorage.getItem('omc_settings') || 'null');
  if (localSettings) {
    const { error } = await saveSettings(localSettings);
    results.settings.success = !error;
    results.settings.error = error;
  }

  return results;
};
