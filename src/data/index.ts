import { ExamTemplate } from '../types/exam';
import CVATemplates from './templates/cva.json';
import MotorAROMTemplates from './templates/motor___a_rom.json';
import FacialpalsyTemplates from './templates/facial_palsy.json';
import DizzinessTemplates from './templates/dizziness.json';
import NeckpainTemplates from './templates/neck_pain.json';
import LowerbackpainTemplates from './templates/lower_back_pain.json';
import ShoulderpainTemplates from './templates/shoulder_pain.json';
import ElbowpainTemplates from './templates/elbow_pain.json';
import WristpainTemplates from './templates/wrist_pain.json';
import HipjointpainTemplates from './templates/hip_joint_pain.json';
import KneepainTemplates from './templates/knee_pain.json';
import AnklepainTemplates from './templates/ankle_pain.json';

export const EXAM_TEMPLATES: ExamTemplate[] = [
  ...CVATemplates,
  ...MotorAROMTemplates,
  ...FacialpalsyTemplates,
  ...DizzinessTemplates,
  ...NeckpainTemplates,
  ...LowerbackpainTemplates,
  ...ShoulderpainTemplates,
  ...ElbowpainTemplates,
  ...WristpainTemplates,
  ...HipjointpainTemplates,
  ...KneepainTemplates,
  ...AnklepainTemplates
] as ExamTemplate[];

export default EXAM_TEMPLATES;
