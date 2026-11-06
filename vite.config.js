import { defineConfig } from 'vite';
import {readFileSync} from 'node:fs';
export default defineConfig({ base:'./', define:{__PLACES__:readFileSync('public/data/places.json','utf8'),__CREDITS__:readFileSync('public/data/photo-credits.json','utf8')}, build:{target:'es2022',chunkSizeWarningLimit:220} });
