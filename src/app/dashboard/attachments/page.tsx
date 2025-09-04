
'use client';

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, Folder as FolderIcon, FileText, MoreVertical, Search, Trash2, User, Loader2, FileUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { getLocalStorage, updateLocalStorage } from "@/lib/localStorage-helpers";
import { Badge } from "@/components/ui/badge";

type Personnel = {
  id: number;
  name: string;
  cardId: string;
  rank: string;
};

type Attachment = {
  id: string;
  personnelId: number;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  dataUrl: string;
};

const getFileIcon = (fileType: string) => {
  if (fileType.startsWith('image/')) return <FileText className="h-5 w-5 text-green-500" />;
  if (fileType === 'application/pdf') return <FileText className="h-5 w-5 text-red-500" />;
  if (fileType.includes('word')) return <FileText className="h-5 w-5 text-blue-500" />;
  return <FileText className="h-5 w-5 text-muted-foreground" />;
};

export default function AttachmentsPage() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [allPersonnel, setAllPersonnel] = useState<Personnel[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Personnel[]>([]);
  const [selectedPersonnel, setSelectedPersonnel] = useState<Personnel | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load all personnel for searching
  useEffect(() => {
    const personnelData = getLocalStorage('personnelData', []);
    setAllPersonnel(personnelData);
  }, []);

  // Effect to select a person if an ID is passed in the URL
  useEffect(() => {
    const personnelId = searchParams.get('personnelId');
    if (personnelId && allPersonnel.length > 0) {
      const person = allPersonnel.find(p => p.id === Number(personnelId));
      if (person) {
        setSelectedPersonnel(person);
      }
    }
  }, [searchParams, allPersonnel]);

  // Effect to load attachments for the selected person
  useEffect(() => {
    if (selectedPersonnel) {
      const allAttachments = getLocalStorage('attachmentsData', []);
      const personAttachments = allAttachments.filter((att: Attachment) => att.personnelId === selectedPersonnel.id);
      setAttachments(personAttachments);
    } else {
      setAttachments([]);
    }
  }, [selectedPersonnel]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }
    const results = allPersonnel.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase()) || p.cardId.includes(query)
    );
    setSearchResults(results.slice(0, 5)); // Limit to 5 results
  };
  
  const handleSelectPersonnel = (person: Personnel) => {
    setSelectedPersonnel(person);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !selectedPersonnel) return;

    setIsLoading(true);

    const allAttachments = getLocalStorage('attachmentsData', []);
    let newAttachments: Attachment[] = [];

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newAttachment: Attachment = {
          id: `${selectedPersonnel.id}-${Date.now()}-${file.name}`,
          personnelId: selectedPersonnel.id,
          name: file.name,
          type: file.type,
          size: `${(file.size / 1024).toFixed(1)} KB`,
          uploadDate: new Date().toISOString(),
          dataUrl: e.target?.result as string,
        };
        newAttachments.push(newAttachment);

        if (newAttachments.length === files.length) {
          const updatedAttachments = [...allAttachments, ...newAttachments];
          updateLocalStorage('attachmentsData', updatedAttachments);
          setAttachments(prev => [...prev, ...newAttachments]);
          setIsLoading(false);
          toast({
            title: 'تم الرفع بنجاح',
            description: `تم رفع ${files.length} ملفات بنجاح.`,
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDelete = (attachmentId: string) => {
    const allAttachments = getLocalStorage('attachmentsData', []);
    const updatedAttachments = allAttachments.filter((att: Attachment) => att.id !== attachmentId);
    updateLocalStorage('attachmentsData', updatedAttachments);
    setAttachments(prev => prev.filter(att => att.id !== attachmentId));
    toast({
      title: 'تم الحذف',
      description: 'تم حذف المرفق بنجاح.',
    });
  };
    
  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2"><FolderIcon className="h-6 w-6"/>إدارة المرفقات</CardTitle>
          <CardDescription>ابحث عن فرد لرفع وعرض مرفقاته.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4 w-full max-w-lg">
            <Search className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="ابحث بالاسم أو رقم البطاقة..." 
              className="pr-10" 
              value={searchQuery}
              onChange={handleSearch}
            />
            {searchResults.length > 0 && (
              <div className="absolute z-10 w-full bg-card border rounded-md shadow-lg mt-1">
                {searchResults.map(p => (
                  <div 
                    key={p.id}
                    className="p-2 hover:bg-muted cursor-pointer"
                    onClick={() => handleSelectPersonnel(p)}
                  >
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-sm text-muted-foreground">{p.rank} - {p.cardId}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedPersonnel && (
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardDescription>مرفقات الفرد</CardDescription>
              <CardTitle className="text-xl flex items-center gap-2">
                <User className="h-5 w-5"/>{selectedPersonnel.name} <Badge variant="secondary">{selectedPersonnel.rank}</Badge>
              </CardTitle>
            </div>
             <input
                type="file"
                multiple
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
            <Button onClick={() => fileInputRef.current?.click()} disabled={isLoading}>
              {isLoading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <FileUp className="ml-2 h-4 w-4" />}
              {isLoading ? 'جاري الرفع...' : 'رفع ملف جديد'}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">الاسم</TableHead>
                    <TableHead className="text-center border-r hidden md:table-cell">تاريخ الرفع</TableHead>
                    <TableHead className="text-center border-r hidden sm:table-cell">الحجم</TableHead>
                    <TableHead className="text-center border-r w-24">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attachments.length > 0 ? (
                    attachments.map((file) => (
                      <TableRow key={file.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium flex items-center justify-center gap-2 text-center">
                          {getFileIcon(file.type)}
                          <span>{file.name}</span>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground text-center border-r">{new Date(file.uploadDate).toLocaleDateString('ar-SA')}</TableCell>
                        <TableCell className="hidden sm:table-cell text-muted-foreground text-center border-r">{file.size}</TableCell>
                        <TableCell className="text-center border-r">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 mx-auto">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onSelect={() => window.open(file.dataUrl, '_blank')}>
                                <FileText className="ml-2 h-4 w-4" />عرض
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => handleDelete(file.id)} className="text-destructive focus:text-destructive">
                                <Trash2 className="ml-2 h-4 w-4" />حذف
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                        لا توجد مرفقات لهذا الفرد.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
