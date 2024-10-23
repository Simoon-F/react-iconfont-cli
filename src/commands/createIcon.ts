#!/usr/bin/env node

import colors from 'colors';
import { getConfig } from '../libs/getConfig';
import { generateComponent } from '../libs/generateComponent';
import axios from 'axios';
import type { XmlData } from './types';
import { parseString } from 'xml2js';

const config = getConfig();

const fetchXmlAndGenerateComponent = async (url: string): Promise<void> => {
  console.log('Fetching iconfont data...');

  try {
    const { data } = await axios.get<string>(url);

    const matches = String(data).match(/'<svg>(.+?)<\/svg>'/);

    if (!matches) throw new Error('You provide a wrong symbol url');

    const result = await new Promise<XmlData>((resolve, reject) => {
      parseString(`<svg>${matches[1]}</svg>`, { rootName: 'svg' }, (err: Error, result: XmlData) => {
        err ? reject(err) : resolve(result);
      });
    });

    generateComponent(result, config);
  } catch (e: any) {
    console.error(colors.red(e?.message || 'Unknown Error'));

    process.exit(1);
  }
};

fetchXmlAndGenerateComponent(config.symbol_url);
