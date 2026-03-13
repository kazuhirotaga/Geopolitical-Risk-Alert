import React from 'react';
export const dynamic = 'force-dynamic';
import { getCombatLogs } from '@/lib/data';
import CombatLogClient from './CombatLogClient';

export default function CombatLogPage() {
    const logs = getCombatLogs();

    return <CombatLogClient logs={logs} />;
}
