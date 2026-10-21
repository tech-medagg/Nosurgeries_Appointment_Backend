import { z } from 'zod';
import { reportCategoryEnum } from '../../db/schema/reportCategoryEnum';

export const uploadReportSchema = z.object({
  // appointmentId is optional, must be UUID if provided
  appointmentId: z.string().uuid().optional(),
  category: z.enum([
    'LAB_REPORT',
    'SCAN',
    'PRESCRIPTION',
    'MEDICAL_HISTORY',
    'DISCHARGE_SUMMARY',
    'OTHER',
  ]),
});
