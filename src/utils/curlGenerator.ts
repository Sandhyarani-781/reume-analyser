export function generateCurlCommand(url: string, payload: Record<string, any>, format: 'json' | 'form-urlencoded' = 'json'): string {
  if (format === 'form-urlencoded') {
    const params = new URLSearchParams();
    Object.entries(payload).forEach(([k, v]) => {
      if (v !== undefined && v !== null) {
        params.append(k, typeof v === 'object' ? JSON.stringify(v) : String(v));
      }
    });
    return `curl -X POST "${url}" \\\n  -H "Content-Type: application/x-www-form-urlencoded" \\\n  -d "${params.toString().replace(/"/g, '\\"')}"`;
  }

  const jsonStr = JSON.stringify(payload, null, 2).replace(/"/g, '\\"');
  return `curl -X POST "${url}" \\\n  -H "Content-Type: application/json" \\\n  -d '${JSON.stringify(payload)}'`;
}

export function downloadJsonFile(filename: string, data: any) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
