"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { demoDataService, DemoUser } from "@/lib/demo-data/demo-service";
import { Upload, Download, FileText, AlertCircle, CheckCircle } from "lucide-react";

export default function AdminUsersPage() {
  const [rows, setRows] = useState<DemoUser[]>([]);
  const [visiblePwdUserId, setVisiblePwdUserId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("staff");
  const [loading, setLoading] = useState(false);
  
  // CSV Import states
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvLoading, setCsvLoading] = useState(false);
  const [csvErrors, setCsvErrors] = useState<string[]>([]);
  const [csvSuccess, setCsvSuccess] = useState<string>("");
  const [showCsvImport, setShowCsvImport] = useState(false);

  const load = () => {
    const users = demoDataService.getAllUsers();
    // Ensure each user has a password for admin visibility
    // Non generare password automatiche: mostra sempre quelle presenti nel DB
    setRows(users);
  };
  
  useEffect(() => { load(); }, []);

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setLoading(true);
    try {
      // Create new user using demo service
      const newUser = demoDataService.addUser({
        name: fullName || email,
        email: email,
        role: role as "admin" | "manager" | "staff" | "workforce" | "dipendente" | "agente",
        store_id: null, // Will be assigned later
        team: null,
        phone: "",
        address: "",
        hire_date: new Date().toISOString(),
        status: "active"
      });
      // Persist the password provided in the form
      if (password && password.trim()) {
        demoDataService.setUserPassword(newUser.id, password.trim());
      }
      
      alert(`Utente "${newUser.name}" creato con successo!`);
      setEmail(""); 
      setPassword(""); 
      setFullName(""); 
      setRole("staff");
      load();
    } catch (err: any) { 
      alert(err?.message ?? String(err)); 
    }
    finally { 
      setLoading(false); 
    }
  };

  const handleCsvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCsvFile(file);
      setCsvErrors([]);
      setCsvSuccess("");
    }
  };

  const handleCsvImport = async () => {
    if (!csvFile) return;
    
    setCsvLoading(true);
    setCsvErrors([]);
    setCsvSuccess("");
    
    try {
      const csvContent = await csvFile.text();
      const { users, errors } = demoDataService.parseCSVUsers(csvContent);
      
      if (errors.length > 0) {
        setCsvErrors(errors);
        setCsvLoading(false);
        return;
      }
      
      if (users.length === 0) {
        setCsvErrors(["Nessun utente valido trovato nel file CSV"]);
        setCsvLoading(false);
        return;
      }
      
      // Create all users
      const createdUsers = demoDataService.bulkCreateUsers(users);
      
      setCsvSuccess(`${createdUsers.length} utenti creati con successo!`);
      setCsvFile(null);
      setShowCsvImport(false);
      load(); // Refresh the user list
      
    } catch (error: any) {
      setCsvErrors([`Errore durante l'importazione: ${error.message}`]);
    }
    
    setCsvLoading(false);
  };

  const downloadTemplate = () => {
    const template = demoDataService.generateCSVTemplate();
    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'template_utenti.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <PageHeader title="Admin: Utenti" desc="Crea e gestisci utenti applicazione" />
      
      {/* CSV Import Section */}
      <Card className="p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="font-medium">Importazione CSV</div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={downloadTemplate}
              className="flex items-center gap-2 px-3 py-1.5 text-sm"
            >
              <Download size={16} />
              Scarica Template
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowCsvImport(!showCsvImport)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm"
            >
              <Upload size={16} />
              {showCsvImport ? 'Nascondi' : 'Importa CSV'}
            </Button>
          </div>
        </div>
        
        {showCsvImport && (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p><strong>Formato CSV richiesto:</strong></p>
              <p>Nome,Email,Ruolo,Password</p>
              <p><strong>Ruoli validi:</strong> admin, manager, staff, workforce, dipendente, agente</p>
            </div>
            
            <div>
              <input
                type="file"
                accept=".csv"
                onChange={handleCsvFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            
            {csvFile && (
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-blue-600" />
                <span className="text-sm">{csvFile.name}</span>
                <Button
                  onClick={handleCsvImport}
                  disabled={csvLoading}
                  className="ml-auto"
                >
                  {csvLoading ? "Importo..." : "Importa"}
                </Button>
              </div>
            )}
            
            {csvErrors.length > 0 && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <div className="flex items-center gap-2 text-red-800 dark:text-red-200 mb-2">
                  <AlertCircle size={16} />
                  <span className="font-medium">Errori di validazione:</span>
                </div>
                <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                  {csvErrors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {csvSuccess && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                  <CheckCircle size={16} />
                  <span className="font-medium">{csvSuccess}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
      
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-3 md:p-4">
          <div className="font-medium mb-2 text-sm md:text-base">Elenco</div>
          <div className="divide-y">
            {rows.map(u => (
              <div key={u.id}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm md:text-base truncate">{u.name}</div>
                    <div className="text-xs text-neutral-500 truncate">{u.email}</div>
                  </div>
                <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                  <div className="uppercase text-xs px-2 py-1 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700">{u.role}</div>
                  <button
                    onClick={() => setVisiblePwdUserId(visiblePwdUserId === u.id ? null : u.id)}
                    className="text-xs px-2 py-1 rounded-md border hover:bg-neutral-50 whitespace-nowrap"
                  >{visiblePwdUserId === u.id ? 'Nascondi' : 'Mostra password'}</button>
                    {u.email && (
                      <button
                        onClick={() => {
                          const link = `${window.location.origin}/login?email=${encodeURIComponent(u.email!)}&r=${encodeURIComponent(u.role)}`;
                          navigator.clipboard.writeText(link);
                          alert("Link di login copiato");
                        }}
                        className="text-xs px-2 py-1 rounded-md border hover:bg-neutral-50 whitespace-nowrap"
                      >Copia login</button>
                    )}
                  </div>
                </div>
                <div className="pl-2 pb-2 text-xs text-neutral-500 break-words">Landing consigliata: {u.role === 'admin' ? '/admin/stores' : (u.role === 'manager' ? '/stores/[storeId]/planner' : (u.role === 'dipendente' || u.role === 'agente' ? '/stores/[storeId]/sales' : '/stores/[storeId]/time'))}</div>
                {visiblePwdUserId === u.id && (
                  <div className="pl-2 pb-3">
                    <div className="inline-flex items-center gap-2 text-xs px-2 py-1 rounded bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700">
                      <span className="opacity-60">Password:</span>
                      <span className="font-mono select-all">{demoDataService.getUserPassword(u.id) ?? '—'}</span>
                      <button
                        onClick={() => {
                          const pwd = demoDataService.getUserPassword(u.id) ?? '';
                          if (pwd) navigator.clipboard.writeText(pwd);
                        }}
                        className="ml-2 px-1 py-0.5 rounded border text-[10px] hover:bg-gray-100 dark:hover:bg-gray-700"
                      >Copia</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {rows.length === 0 && <div className="text-sm text-neutral-500">Nessun utente</div>}
          </div>
        </Card>
        <Card className="p-3 md:p-4">
          <div className="font-medium mb-2 text-sm md:text-base">Nuovo utente</div>
          <form onSubmit={onCreate} className="space-y-3">
            <div>
              <label className="text-xs md:text-sm">Nome completo</label>
              <Input value={fullName} onChange={(e)=>setFullName(e.target.value)} placeholder="(opzionale)" className="text-sm" />
            </div>
            <div>
              <label className="text-xs md:text-sm">Email</label>
              <Input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" required className="text-sm" />
            </div>
            <div>
              <label className="text-xs md:text-sm">Password</label>
              <Input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" required className="text-sm" />
            </div>
            <div>
              <label className="text-xs md:text-sm">Ruolo app</label>
              <select value={role} onChange={(e)=>setRole(e.target.value)} className="border rounded-lg px-2 py-2 text-sm w-full">
                <option value="staff">staff</option>
                <option value="manager">manager</option>
                <option value="admin">admin</option>
                <option value="workforce">workforce</option>
                <option value="dipendente">dipendente</option>
                <option value="agente">agente</option>
              </select>
            </div>
            <Button type="submit" disabled={loading} className="w-full text-sm">{loading ? "Creo..." : "Crea utente"}</Button>
          </form>
        </Card>
      </div>
    </>
  );
}
