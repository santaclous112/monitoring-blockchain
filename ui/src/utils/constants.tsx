import { Env } from '@stencil/core';

export const HOME_URL: string = '/';
export const baseChainsNames: string[] = ["cosmos", "general", "chainlink", "substrate"];
export const apiURL: string = `https://${Env.API_IP}:${Env.API_PORT}/server/`;
export const criticalIcon = { "svc-buttons-container": { 'svc-button': { props: { 'icon-name': 'skull', 'icon-position': 'icon-only', 'color': 'dark' } } } };
export const warningIcon = { "svc-buttons-container": { 'svc-button': { props: { 'icon-name': 'warning', 'icon-position': 'icon-only', 'color': 'warning' } } } };
export const errorIcon = { "svc-buttons-container": { 'svc-button': { props: { 'icon-name': 'alert-circle', 'icon-position': 'icon-only', 'color': 'danger' } } } };
export const infoIcon = { "svc-buttons-container": { 'svc-button': { props: { 'icon-name': 'alert-circle', 'icon-position': 'icon-only', 'color': 'success' } } } };
// Polling frequency in milliseconds.
export const pollingFrequency: number = 5000;
// Maximum number of alerts within alerts overview.
export const maxNumberOfAlerts: number = 1000;

// Test Related
export const fetchMock: any = fetch as any;