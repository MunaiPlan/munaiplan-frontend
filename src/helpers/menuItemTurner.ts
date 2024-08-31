import React from 'react';
import { ICompany, IField, ISite, IWell, IWellBore, IDesign, ICase } from '../types/types';
import { MenuItem } from '../components/SideBarItem';

// Function to convert fields to MenuItem[]
export const convertFieldsToMenuItems = (fields: IField[]): MenuItem[] => {
  return fields.map(field => ({
    id: field.id,
    name: field.name,
    children: field.sites ? convertSitesToMenuItems(field.sites) : [], // Convert sites to MenuItem[]
  }));
};

// Function to convert sites to MenuItem[]
const convertSitesToMenuItems = (sites: ISite[]): MenuItem[] => {
  return sites.map(site => ({
    id: site.id,
    name: site.name,
    children: site.wells ? convertWellsToMenuItems(site.wells) : [], // Convert wells to MenuItem[]
  }));
};

// Function to convert wells to MenuItem[]
const convertWellsToMenuItems = (wells: IWell[]): MenuItem[] => {
  return wells.map(well => ({
    id: well.id,
    name: well.name,
    children: well.wellBores ? convertWellBoresToMenuItems(well.wellBores) : [], // Convert well bores to MenuItem[]
  }));
};

// Function to convert well bores to MenuItem[]
const convertWellBoresToMenuItems = (wellBores: IWellBore[]): MenuItem[] => {
  return wellBores.map(wellBore => ({
    id: wellBore.id,
    name: wellBore.name,
    children: wellBore.designs ? convertDesignsToMenuItems(wellBore.designs) : [], // Convert designs to MenuItem[]
  }));
};

// Function to convert designs to MenuItem[]
const convertDesignsToMenuItems = (designs: IDesign[]): MenuItem[] => {
  return designs.map(design => ({
    id: design.id,
    name: design.planName,
    children: design.cases ? convertCasesToMenuItems(design.cases) : [], // Convert cases to MenuItem[]
  }));
};

// Function to convert cases to MenuItem[]
const convertCasesToMenuItems = (cases: ICase[]): MenuItem[] => {
  return cases.map(caseItem => ({
    id: caseItem.id,
    name: caseItem.caseName,
  }));
};