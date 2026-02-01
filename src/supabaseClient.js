import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vswtnkruqmsthogxxmsp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzd3Rua3J1cW1zdGhvZ3h4bXNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY5MzkxNjIsImV4cCI6MjA1MjUxNTE2Mn0.BridCRPKKL_UUlNJJJ7rpb1k33XL4vMLGLGPbNmKfSo';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Test de connexion
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('produits').select('count', { count: 'exact', head: true });
    return !error;
  } catch (e) {
    return false;
  }
};

// =================== PRODUITS ===================
export const fetchProduits = async () => {
  const { data, error } = await supabase
    .from('produits')
    .select('*')
    .order('nomOMC', { ascending: true });
  
  if (error) {
    console.error('Erreur fetch produits:', error);
    return [];
  }
  return data || [];
};

export const saveProduit = async (produit) => {
  const { id, ...produitData } = produit;
  
  if (id && !id.startsWith('temp_')) {
    const { data, error } = await supabase
      .from('produits')
      .update(produitData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from('produits')
      .insert([produitData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

export const deleteProduit = async (id) => {
  const { error } = await supabase
    .from('produits')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
};

// =================== FOURNISSEURS ===================
export const fetchFournisseurs = async () => {
  const { data, error } = await supabase
    .from('fournisseurs')
    .select('*')
    .order('nom', { ascending: true });
  
  if (error) {
    console.error('Erreur fetch fournisseurs:', error);
    return [];
  }
  return data || [];
};

export const saveFournisseur = async (fournisseur) => {
  const { id, ...fournisseurData } = fournisseur;
  
  if (id && !id.startsWith('temp_')) {
    const { data, error } = await supabase
      .from('fournisseurs')
      .update(fournisseurData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from('fournisseurs')
      .insert([fournisseurData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

export const deleteFournisseur = async (id) => {
  const { error } = await supabase
    .from('fournisseurs')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
};

// =================== ASSEMBLAGES ===================
export const fetchAssemblages = async () => {
  const { data, error } = await supabase
    .from('assemblages')
    .select('*')
    .order('nom', { ascending: true });
  
  if (error) {
    console.error('Erreur fetch assemblages:', error);
    return [];
  }
  return data || [];
};

export const saveAssemblage = async (assemblage) => {
  const { id, ...assemblageData } = assemblage;
  
  if (id && !id.startsWith('temp_')) {
    const { data, error } = await supabase
      .from('assemblages')
      .update(assemblageData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from('assemblages')
      .insert([assemblageData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

export const deleteAssemblage = async (id) => {
  const { error } = await supabase
    .from('assemblages')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
};

// =================== SETTINGS ===================
export const fetchSettings = async () => {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .limit(1)
    .single();
  
  if (error && error.code !== 'PGRST116') {
    console.error('Erreur fetch settings:', error);
    return null;
  }
  return data;
};

export const saveSettings = async (settings) => {
  const { data: existing } = await supabase
    .from('settings')
    .select('id')
    .limit(1)
    .single();
  
  if (existing) {
    const { data, error } = await supabase
      .from('settings')
      .update(settings)
      .eq('id', existing.id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from('settings')
      .insert([settings])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// =================== VENTES (LOYVERSE) ===================
export const fetchVentes = async (dateDebut = null, dateFin = null) => {
  let query = supabase
    .from('ventes')
    .select('*')
    .order('receipt_date', { ascending: false });
  
  if (dateDebut) {
    query = query.gte('receipt_date', dateDebut);
  }
  if (dateFin) {
    query = query.lte('receipt_date', dateFin);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Erreur fetch ventes:', error);
    return [];
  }
  return data || [];
};

// Récupérer les stats de ventes agrégées
export const fetchVentesStats = async (jours = 7) => {
  const dateDebut = new Date();
  dateDebut.setDate(dateDebut.getDate() - jours);
  
  const { data, error } = await supabase
    .from('ventes')
    .select('*')
    .gte('receipt_date', dateDebut.toISOString());
  
  if (error) {
    console.error('Erreur fetch ventes stats:', error);
    return null;
  }
  
  if (!data || data.length === 0) {
    return {
      caTotal: 0,
      nbTransactions: 0,
      nbArticles: 0,
      panierMoyen: 0,
      coutTotal: 0,
      margeTotal: 0,
      margePct: 0,
      topProduits: [],
      ventesParJour: [],
      ventesParHeure: []
    };
  }
  
  // Calculs
  const caTotal = data.reduce((sum, v) => sum + (parseFloat(v.net_total) || 0), 0);
  const coutTotal = data.reduce((sum, v) => sum + (parseFloat(v.cost) || 0), 0);
  const nbArticles = data.length;
  const receiptsUniques = [...new Set(data.map(v => v.receipt_number))];
  const nbTransactions = receiptsUniques.length;
  const panierMoyen = nbTransactions > 0 ? caTotal / nbTransactions : 0;
  const margeTotal = caTotal - coutTotal;
  const margePct = caTotal > 0 ? (margeTotal / caTotal) * 100 : 0;
  
  // Top produits par CA
  const ventesParProduit = {};
  data.forEach(v => {
    const nom = v.item_name || 'Inconnu';
    if (!ventesParProduit[nom]) {
      ventesParProduit[nom] = { nom, quantite: 0, ca: 0, cout: 0 };
    }
    ventesParProduit[nom].quantite += parseFloat(v.quantity) || 0;
    ventesParProduit[nom].ca += parseFloat(v.net_total) || 0;
    ventesParProduit[nom].cout += parseFloat(v.cost) || 0;
  });
  
  const topProduits = Object.values(ventesParProduit)
    .sort((a, b) => b.ca - a.ca)
    .slice(0, 10);
  
  // Ventes par jour
  const ventesParJour = {};
  data.forEach(v => {
    const date = v.receipt_date ? v.receipt_date.split('T')[0] : 'Inconnu';
    if (!ventesParJour[date]) {
      ventesParJour[date] = { date, ca: 0, transactions: new Set() };
    }
    ventesParJour[date].ca += parseFloat(v.net_total) || 0;
    ventesParJour[date].transactions.add(v.receipt_number);
  });
  
  const ventesParJourArray = Object.values(ventesParJour)
    .map(v => ({ ...v, nbTransactions: v.transactions.size }))
    .sort((a, b) => a.date.localeCompare(b.date));
  
  // Ventes par heure
  const ventesParHeure = {};
  data.forEach(v => {
    if (v.receipt_date) {
      const heure = new Date(v.receipt_date).getHours();
      if (!ventesParHeure[heure]) {
        ventesParHeure[heure] = { heure, ca: 0, nbVentes: 0 };
      }
      ventesParHeure[heure].ca += parseFloat(v.net_total) || 0;
      ventesParHeure[heure].nbVentes += 1;
    }
  });
  
  const ventesParHeureArray = Object.values(ventesParHeure)
    .sort((a, b) => a.heure - b.heure);
  
  return {
    caTotal,
    nbTransactions,
    nbArticles,
    panierMoyen,
    coutTotal,
    margeTotal,
    margePct,
    topProduits,
    ventesParJour: ventesParJourArray,
    ventesParHeure: ventesParHeureArray
  };
};

// Récupérer la date de dernière synchronisation
export const getLastSyncDate = async () => {
  const { data, error } = await supabase
    .from('ventes')
    .select('created_at')
    .order('created_at', { ascending: false })
    .limit(1);
  
  if (error || !data || data.length === 0) {
    return null;
  }
  return data[0].created_at;
};

// =================== FORMULES ===================
export const fetchFormules = async () => {
  const { data, error } = await supabase
    .from('formules')
    .select('*')
    .order('nom', { ascending: true });
  
  if (error) {
    console.error('Erreur fetch formules:', error);
    return [];
  }
  return data || [];
};

export const saveFormule = async (formule) => {
  const { id, ...formuleData } = formule;
  
  if (id && !id.startsWith('temp_')) {
    const { data, error } = await supabase
      .from('formules')
      .update(formuleData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from('formules')
      .insert([formuleData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

export const deleteFormule = async (id) => {
  const { error } = await supabase
    .from('formules')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
};

// =================== CATEGORIES ASSEMBLAGES ===================
export const fetchCategoriesAssemblages = async () => {
  const { data, error } = await supabase
    .from('categories_assemblages')
    .select('*')
    .order('ordre', { ascending: true });
  
  if (error) {
    console.error('Erreur fetch categories assemblages:', error);
    return [];
  }
  return data || [];
};

export const saveCategorieAssemblage = async (categorie) => {
  const { id, ...categorieData } = categorie;
  
  if (id && !id.startsWith('temp_')) {
    const { data, error } = await supabase
      .from('categories_assemblages')
      .update(categorieData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from('categories_assemblages')
      .insert([categorieData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

export const deleteCategorieAssemblage = async (id) => {
  const { error } = await supabase
    .from('categories_assemblages')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
};

// Migration depuis localStorage
export const migrateFromLocalStorage = async () => {
  // Cette fonction peut être utilisée pour migrer des données existantes
  console.log('Migration disponible si nécessaire');
  return true;
};
