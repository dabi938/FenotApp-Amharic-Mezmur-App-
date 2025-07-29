import * as የአዲስ_ዓመት_መዝሙራት from './የአዲስ ዓመት መዝሙራት';
import * as የመስከረም10_መዝሙራት from './የመስከረም10 መዝሙራት';
import * as የመስቀል_መዝሙራት from './የመስቀል መዝሙራት';
import * as የጽጌ_መዝሙራት from './የጽጌ መዝሙራት';
import * as የህዳር_ፅዮን_መዝሙራት from './የህዳር ፅዮን መዝሙራት';
import * as የልደት_መዝሙራት from './የልደት መዝሙራት';
import * as የከተራ_መዝሙራት from './የከተራና የጥምቀት መዝሙራት';
import * as የንስሃ_መዝሙራት from './የንስሃ መዝሙራት';
import * as የሆሣዕና_መዝሙራት from './የሆሣዕና መዝሙራት';
import * as የትንሣኤና_የዕርገት_መዝሙራት from './የትንሣኤና የዕርገት መዝሙራት';
import * as የሰርግ_መዝሙራት from './የሰርግ መዝሙራት';
import * as የህፃናት_መዝሙራት from './የህፃናት መዝሙራት';
import * as የምስጋና_መዝሙራት from './የምስጋና መዝሙራት';
import * as የእመቤታችን_መዝሙራት from './የእመቤታችን መዝሙራት';
import * as የመላዕክት_መዝሙራት from './የመላዕክት መዝሙራት';
import * as የቅዱሳን_ፃድቃን_መዝሙራት from './የቅዱሳን ፃድቃን መዝሙራት';
import * as የቅዱስ_ጊዮርጊስ_መዝሙራት from './የቅዱስ ጊዮርጊስ መዝሙራት';
import * as የደብረ_ታቦር_መዝሙራት from './የደብረ ታቦር መዝሙራት';
import * as Faarfannaa_Afaan_oromoo from './Faarfannaa Afaan oromoo';
import * as የወረብ_ዝማሬያት from './የወረብ ዝማሬያት';


export const poems = [
  ...Object.values(የአዲስ_ዓመት_መዝሙራት),
  ...Object.values(የመስከረም10_መዝሙራት),
  ...Object.values(የመስቀል_መዝሙራት),
  ...Object.values(የጽጌ_መዝሙራት),
  ...Object.values(የህዳር_ፅዮን_መዝሙራት),
  ...Object.values(የልደት_መዝሙራት),
  ...Object.values(የከተራ_መዝሙራት),
  ...Object.values(የንስሃ_መዝሙራት),
  ...Object.values(የሆሣዕና_መዝሙራት),
  ...Object.values(የትንሣኤና_የዕርገት_መዝሙራት),
  ...Object.values(የሰርግ_መዝሙራት),
  ...Object.values(የህፃናት_መዝሙራት),
  ...Object.values(የምስጋና_መዝሙራት),
  ...Object.values(የእመቤታችን_መዝሙራት),
  ...Object.values(የመላዕክት_መዝሙራት),
  ...Object.values(የቅዱሳን_ፃድቃን_መዝሙራት),
  ...Object.values(የቅዱስ_ጊዮርጊስ_መዝሙራት),
  ...Object.values(የደብረ_ታቦር_መዝሙራት),
  // ...Object.values(Faarfannaa_Afaan_oromoo),
  // ...Object.values(የወረብ_ዝማሬያት),

].filter(Boolean); // This removes null/undefined poems

export const categories = [...new Set(poems.map(p => p.category).filter(Boolean))];