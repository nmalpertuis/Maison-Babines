-- Maison Babines — schéma du CRM (Supabase / PostgreSQL)
-- À exécuter une fois dans Supabase > SQL Editor.

create extension if not exists "pgcrypto";

-- Clients (un par e-mail)
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  prenom text,
  nom text,
  telephone text,
  ville text,
  source text default 'site',             -- site, contact, newsletter, pro
  segment text default 'particulier',     -- particulier, pro, influenceur
  notes text,
  created_at timestamptz not null default now()
);

-- Chiens rattachés à un client
create table if not exists public.chiens (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete cascade,
  nom text not null,
  race text,
  taille text,
  created_at timestamptz not null default now()
);

-- Réservations (tunnel de la malle)
create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  numero text unique not null,             -- MB-2026-XXXX
  client_email text not null,
  client_nom text,
  telephone text,
  chien text,
  mode_livraison text,                     -- domicile, relais, evenement
  adresse text,
  date_evenement date,
  date_livraison date,
  articles jsonb not null default '[]',    -- [{productId, nom, taille, prix, options}]
  sous_total numeric(10,2) not null default 0,
  remise numeric(10,2) not null default 0,
  livraison numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  caution numeric(10,2) not null default 0,
  code_promo text,
  statut text not null default 'nouvelle', -- nouvelle, preparee, expediee, livree, retournee, cloturee, annulee
  notes text,
  created_at timestamptz not null default now()
);

-- Messages du formulaire de contact
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  email text not null,
  telephone text,
  sujet text not null,
  chien text,
  date_evenement date,
  numero_reservation text,
  message text not null,
  statut text not null default 'nouveau',  -- nouveau, en_cours, traite
  created_at timestamptz not null default now()
);

-- Abonnés à la Gazette du Grand Hôtel
create table if not exists public.newsletter (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  source text default 'footer',
  created_at timestamptz not null default now()
);

-- Avis déposés (à modérer)
create table if not exists public.avis (
  id uuid primary key default gen_random_uuid(),
  prenom text not null,
  chien text,
  race text,
  occasion text,
  tenue text,
  note int check (note between 1 and 5),
  texte text not null,
  statut text not null default 'a_moderer', -- a_moderer, publie, refuse
  created_at timestamptz not null default now()
);

-- Sécurité : le site public (clé anon) peut seulement INSÉRER.
-- La lecture et la modification sont réservées aux utilisateurs connectés (équipe Babines).
alter table public.clients      enable row level security;
alter table public.chiens       enable row level security;
alter table public.reservations enable row level security;
alter table public.messages     enable row level security;
alter table public.newsletter   enable row level security;
alter table public.avis         enable row level security;

do $$
declare t text;
begin
  foreach t in array array['clients','chiens','reservations','messages','newsletter','avis'] loop
    execute format('drop policy if exists "public_insert" on public.%I', t);
    execute format('create policy "public_insert" on public.%I for insert to anon, authenticated with check (true)', t);
    execute format('drop policy if exists "equipe_all" on public.%I', t);
    execute format('create policy "equipe_all" on public.%I for all to authenticated using (true) with check (true)', t);
  end loop;
end $$;

-- Upsert client depuis le site (sans exposer la lecture de la table)
create or replace function public.upsert_client(p_email text, p_prenom text, p_nom text, p_telephone text, p_source text)
returns void language sql security definer set search_path = public as $$
  insert into public.clients (email, prenom, nom, telephone, source)
  values (lower(p_email), p_prenom, p_nom, nullif(p_telephone, ''), p_source)
  on conflict (email) do update set
    prenom = coalesce(excluded.prenom, clients.prenom),
    nom = coalesce(excluded.nom, clients.nom),
    telephone = coalesce(excluded.telephone, clients.telephone);
$$;
grant execute on function public.upsert_client(text, text, text, text, text) to anon, authenticated;
