"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, X } from "lucide-react"
import { conventionService, type Convention } from "@/lib/convention-service"

interface ViewConventionPdfModalProps {
  isOpen: boolean
  onClose: () => void
  convention: Convention | null
}

export function ViewConventionPdfModal({ isOpen, onClose, convention }: ViewConventionPdfModalProps) {
  if (!convention) return null

  const pdfUrl = `http://localhost:9001/api/conventions/${convention.idConvention}/pdf`

  const handleDownload = () => {
    conventionService.downloadConvention(convention.idConvention)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Convention - {convention.candidature.etudiantUsername}</DialogTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Télécharger
              </Button>
              <Button variant="outline" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        <div className="flex-1 border rounded-lg overflow-hidden">
          <iframe
            src={pdfUrl}
            className="w-full h-full"
            title="Convention PDF"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}