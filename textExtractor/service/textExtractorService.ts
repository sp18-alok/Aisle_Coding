export type Item = { 
    quantity: number; 
    imported: boolean; 
    itemName: string; 
    price: number; 
};

export function parseShoppingInput(input: string): Item[] {
    const text = input.trim().replace(/\n+/g, " ");
    const pattern = /(\d+)\s+(.+?)\s+at\s+([\d.]+)(?=\s+\d+\s+|$)/gi;
    const items: Item[] = [];
    let match;

    while ((match = pattern.exec(text)) !== null) {
      const qty = parseInt(match[1]);
      const name = match[2].trim();
      const isImported = name.toLowerCase().includes("imported");
      const cleanName = name.replace(/imported/gi, "").replace(/\s+/g, " ").trim();
      const price = parseFloat(match[3]);
      
      items.push({ 
        quantity: qty, 
        imported: isImported, 
        itemName: cleanName, 
        price 
      });
    }
    
    return items;
}

export function calculateTotal(items: Item[]): number {
    let total = 0;
    for (const item of items) {
      total += item.price * item.quantity;
    }
    return Number(total.toFixed(2));
}

export function prettyLines(items: Item[]): string[] {
    const lines: string[] = [];
    
    lines.push("Parsed Shopping Items:");
    lines.push("==================================================");
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const importedText = item.imported ? "imported " : "";
      lines.push(`${i + 1}. ${item.quantity} ${importedText}${item.itemName} at $${item.price.toFixed(2)}`);
    }
    
    lines.push("==================================================");
    lines.push(`Total: $${calculateTotal(items).toFixed(2)}`);
    
    return lines;
}