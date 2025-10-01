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