import { describe, it, expect } from 'vitest';
import { getSadReply } from '@/lib/insurance-data';
describe('SAD demo safeguards',()=>{
 it('identifies advice as simulated instead of licensed',()=>{expect(getSadReply('something unrelated')).toContain('simulated assistant, not a licensed insurance adviser');});
 it('does not imply real policy issuance',()=>{expect(getSadReply('renew my policy')).toContain('No real payment or policy issuance');});
});
