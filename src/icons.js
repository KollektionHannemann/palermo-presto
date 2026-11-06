const paths={
 search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/>',
 heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
 locate:'<circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3"/>',
 sliders:'<path d="M4 7h7m4 0h5M4 17h3m4 0h9"/><circle cx="13" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
 map:'<path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2Zm6-2v16m6-14v16"/>',
 grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
 compass:'<circle cx="12" cy="12" r="9"/><path d="m16 8-2.5 5.5L8 16l2.5-5.5Z"/>',
 sparkles:'<path d="m12 3 2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4ZM20 2v4m-2-2h4"/>',
 utensils:'<path d="M4 3v6a3 3 0 0 0 6 0V3M7 3v18m11-18v18m0-18c-5 2-5 9 0 9"/>',
 store:'<path d="m3 9 2-6h14l2 6M3 9v3a3 3 0 0 0 4.5 2.6A3 3 0 0 0 12 14a3 3 0 0 0 4.5.6A3 3 0 0 0 21 12V9H3Zm2 6v6h14v-6m-9 6v-5h4v5"/>',
 coffee:'<path d="M4 8h12v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4Zm12 1h2a3 3 0 0 1 0 6h-2M7 2v3m5-3v3"/>',
 pizza:'<path d="m12 3 9 17H3L12 3Zm-7.5 14h15"/><circle cx="12" cy="10" r="1"/><circle cx="9" cy="14" r=".7"/><circle cx="15" cy="14" r=".7"/>',
 wine:'<path d="M8 3h8l1 7a5 5 0 0 1-10 0l1-7Zm4 12v6m-4 0h8M8 8h8"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
 cake:'<path d="M3 11h18v10H3V11Zm0 4c3 3 4-3 6 0s4-3 6 0 3-3 6 0M8 11V7h8v4M12 7V3m-1-1 1-1 1 1"/>',
 landmark:'<path d="m3 8 9-5 9 5H3Zm2 3v7m5-7v7m4-7v7m5-7v7M3 21h18"/>',
 leaf:'<path d="M20 3C10 1 2 6 5 15c6 7 17 1 15-12ZM4 21 16 9"/>',
 arrow:'<path d="M5 12h14m-5-5 5 5-5 5"/>',
 phone:'<path d="m8 3 2 5-3 2a12 12 0 0 0 7 7l2-3 5 2v4c-9 3-20-8-18-16l5-1Z"/>',
 share:'<path d="M12 15V3m-4 4 4-4 4 4M5 12v8h14v-8"/>'
};
export const icon=name=>`<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${paths[name]??paths.sparkles}</svg>`;
