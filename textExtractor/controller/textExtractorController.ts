'use strict';

import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import * as textExtractorService from '../service/textExtractorService';

let lastItems: textExtractorService.Item[] = [];

export const parseInput = asyncHandler(async (req: Request, res: Response) => {
    const { input } = req.body as { input?: string };

    if (!input || !input.trim()) {
        res.status(400).json({
            success: false,
            message: 'Input is required'
        });
        return;
    }

    lastItems = textExtractorService.parseShoppingInput(input);

    res.json({
        success: true,
        message: 'Input processed successfully!!',
        data: {}
    });
});

export const getItemData = asyncHandler(async (_req: Request, res: Response) => {
    const total = textExtractorService.calculateTotal(lastItems);
    const lines = textExtractorService.prettyLines(lastItems);

    res.json({
        success: true,
        message: 'Items data fetched successfully !!',
        data: { items: lastItems}
    });
});