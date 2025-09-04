
'use client';

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, Folder as FolderIcon, FileText, MoreVertical, Search, Trash2, User, Loader2, FileUp, Eye, Edit, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { getLocalStorage, updateLocalStorage } from "@/lib/localStorage-helpers";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";


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
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [editingAttachment, setEditingAttachment] = useState<Attachment | null>(null);
  const [newAttachmentName, setNewAttachmentName] = useState("");

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
  
  const openEditDialog = (attachment: Attachment) => {
    setEditingAttachment(attachment);
    setNewAttachmentName(attachment.name);
    setEditDialogOpen(true);
  };

  const handleUpdateName = () => {
    if (!editingAttachment || !newAttachmentName.trim()) return;

    const allAttachments = getLocalStorage('attachmentsData', []);
    const updatedAttachments = allAttachments.map((att: Attachment) => 
      att.id === editingAttachment.id ? { ...att, name: newAttachmentName.trim() } : att
    );
    
    updateLocalStorage('attachmentsData', updatedAttachments);
    setAttachments(prev => prev.map(att => 
      att.id === editingAttachment.id ? { ...att, name: newAttachmentName.trim() } : att
    ));
    
    toast({
      title: 'تم التحديث',
      description: 'تم تحديث اسم المرفق بنجاح.',
    });

    setEditDialogOpen(false);
    setEditingAttachment(null);
    setNewAttachmentName("");
  };

  const handleDelete = (attachmentId: string) => {
    const allAttachments = getLocalStorage('attachmentsData', []);
    const updatedAttachments = allAttachments.filter((att: Attachment) => att.id !== attachmentId);
    updateLocalStorage('attachmentsData', updatedAttachments);
    setAttachments(prev => prev.filter(att => att.id !== attachmentId));
    toast({
      title: 'تم الحذف',
      description: 'تم حذف المرفق بنجاح.',
      variant: 'destructive'
    });
  };
    
  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2"><FolderIcon className="h-6 w-6"/>إدارة المرفقات</CardTitle>
          <CardDescription>ابحث عن فرد لرفع وعرض مرفقاته.</CardDescription>
           <div className="pt-2">
                <div className="flex items-start rounded-md border border-l-4 border-l-blue-500 bg-muted/30 p-4">
                    <AlertCircle className="h-6 w-6 mr-3 text-blue-500 flex-shrink-0" />
                    <div>
                        <h4 className="font-semibold text-foreground">المرفقات المطلوبة</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                            صورة شخصية للرتبة الحالية بحجم البوستال، صورة للبطاقة العسكرية، صورة من الرقم الوطني، صورة من الشهادات العسكرية، صورة من الشهادات الأكاديمية.
                        </p>
                    </div>
                </div>
            </div>
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
                    <TableHead className="text-center border-r w-32">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attachments.length > 0 ? (
                    attachments.map((file) => (
                      <TableRow key={file.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium flex items-center justify-start gap-2 text-right">
                          {getFileIcon(file.type)}
                          <span className="truncate" title={file.name}>{file.name}</span>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground text-center border-r">{new Date(file.uploadDate).toLocaleDateString('ar-SA')}</TableCell>
                        <TableCell className="hidden sm:table-cell text-muted-foreground text-center border-r">{file.size}</TableCell>
                        <TableCell className="text-center border-r">
                           <div className="flex items-center justify-center gap-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => window.open(file.dataUrl, '_blank')}><Eye className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(file)}><Edit className="h-4 w-4" /></Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive h-8 w-8">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
                                        <AlertDialogDescription>
                                        سيتم حذف المرفق '{file.name}' بشكل دائم. لا يمكن التراجع عن هذا الإجراء.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                        <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => handleDelete(file.id)}>حذف</AlertDialogAction>
                                    </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
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
             <Dialog open={isEditDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>تعديل اسم المرفق</DialogTitle>
                        <DialogDescription>
                            أدخل الاسم الجديد للمرفق ثم اضغط على حفظ.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                الاسم
                            </Label>
                            <Input
                                id="name"
                                value={newAttachmentName}
                                onChange={(e) => setNewAttachmentName(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="secondary" onClick={() => setEditDialogOpen(false)}>إلغاء</Button>
                        <Button type="submit" onClick={handleUpdateName}>حفظ التغييرات</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      )}
    </div>
  );

    

    

    