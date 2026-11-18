import type {
  ActivityConfig,
  ActivityType,
  CriterionDefinition,
  PerformanceLevel,
  PerformanceLevelKey,
  ScoreInput,
} from '../types.ts';

export const PERFORMANCE_LEVELS: readonly PerformanceLevel[] = [
  { key: 'excelente', label: 'Excelente', range: '10', suggestedScore: 10 },
  { key: 'bom', label: 'Bom', range: '9–7', suggestedScore: 8 },
  { key: 'satisfatorio', label: 'Satisfatório', range: '6–1', suggestedScore: 5 },
  { key: 'insuficiente', label: 'Insuficiente', range: '0', suggestedScore: 0 },
] as const;

export const PROJECT_CRITERIA: readonly CriterionDefinition[] = [
  {
    id: 'identificacao',
    number: 1,
    name: 'Identificação do projeto',
    weight: 0.10,
    weightPercent: 10,
    descriptors: {
      excelente:
        'Apresenta de forma completa e clara o nome do projeto, o público-alvo, a duração prevista e a identificação do formando.',
      bom: 'Apresenta os elementos solicitados, com pequenas omissões ou imprecisões.',
      satisfatorio:
        'Apresenta informação incompleta ou pouco clara, faltando elementos relevantes.',
      insuficiente:
        'Não identifica o projeto ou omite a maioria dos elementos solicitados.',
    },
  },
  {
    id: 'problema',
    number: 2,
    name: 'Problema, necessidade ou oportunidade identificada',
    weight: 0.20,
    weightPercent: 20,
    descriptors: {
      excelente:
        'Identifica e contextualiza claramente uma necessidade, dificuldade ou oportunidade real, relevante e pertinente para a escola ou comunidade educativa.',
      bom: 'Identifica uma necessidade ou oportunidade pertinente, embora a contextualização possa ser aprofundada.',
      satisfatorio:
        'Apresenta uma necessidade ou oportunidade genérica, pouco contextualizada ou de relevância pouco evidente.',
      insuficiente:
        'Não identifica um problema, necessidade ou oportunidade, ou apresenta uma situação sem relação com o contexto educativo.',
    },
  },
  {
    id: 'objetivo',
    number: 3,
    name: 'Objetivo do projeto',
    weight: 0.15,
    weightPercent: 15,
    descriptors: {
      excelente:
        'Define um objetivo claro, específico e exequível, diretamente relacionado com a necessidade identificada.',
      bom: 'Define um objetivo pertinente e relacionado com a necessidade identificada, embora possa ser mais específico ou operacionalizável.',
      satisfatorio:
        'Apresenta um objetivo vago, pouco claro, parcialmente relacionado com a necessidade ou de exequibilidade duvidosa.',
      insuficiente:
        'Não apresenta um objetivo claro ou este não responde à necessidade identificada.',
    },
  },
  {
    id: 'descricao',
    number: 4,
    name: 'Descrição e adequação da proposta',
    weight: 0.25,
    weightPercent: 25,
    descriptors: {
      excelente:
        'Descreve concretamente o que será criado ou implementado, como funcionará e quem o utilizará; a proposta é coerente, exequível e adequada ao contexto e ao público-alvo, explicitando o impacto esperado.',
      bom: 'Descreve os elementos principais da proposta e a sua adequação, embora alguns aspetos de funcionamento, exequibilidade ou impacto precisem de maior clarificação.',
      satisfatorio:
        'A descrição é incompleta ou pouco concreta, tornando difícil compreender o funcionamento, a adequação ou a exequibilidade da proposta.',
      insuficiente:
        'Não descreve de forma compreensível a proposta ou esta não se revela adequada ao contexto identificado.',
    },
  },
  {
    id: 'ferramentas',
    number: 5,
    name: 'Seleção e utilização das ferramentas de IA',
    weight: 0.15,
    weightPercent: 15,
    descriptors: {
      excelente:
        'Identifica as ferramentas de IA e explicita, de forma pertinente e concreta, a finalidade e o contributo de cada uma para o desenvolvimento do projeto.',
      bom: 'Identifica as ferramentas e as respetivas finalidades, embora a articulação com o projeto ou o contributo da IA possa ser mais claro.',
      satisfatorio:
        'Identifica ferramentas, mas apresenta finalidades genéricas, pouco justificadas ou com ligação pouco evidente ao projeto.',
      insuficiente:
        'Não identifica ferramentas de IA ou não explica a sua utilização no projeto.',
    },
  },
  {
    id: 'beneficios',
    number: 6,
    name: 'Benefícios e valor do projeto',
    weight: 0.15,
    weightPercent: 15,
    descriptors: {
      excelente:
        'Explicita benefícios concretos, relevantes e plausíveis para o público-alvo, a escola ou a comunidade educativa, coerentes com a proposta.',
      bom: 'Apresenta benefícios pertinentes e relacionados com a proposta, embora pouco desenvolvidos ou específicos.',
      satisfatorio:
        'Refere benefícios vagos, genéricos ou apenas parcialmente relacionados com a proposta.',
      insuficiente:
        'Não identifica benefícios ou os benefícios apresentados não têm relação com o projeto.',
    },
  },
] as const;

export const SCENARIO_CRITERIA: readonly CriterionDefinition[] = [
  {
    id: 'enquadramento',
    number: 1,
    name: 'Enquadramento',
    weight: 0.10,
    weightPercent: 10,
    descriptors: {
      excelente:
        'Apresenta todos os elementos solicitados: disciplina, ano de escolaridade, duração prevista, tema/conteúdo curricular e nome do professor.',
      bom: 'Apresenta os elementos solicitados, com pequenas omissões ou imprecisões.',
      satisfatorio:
        'Apresenta informação incompleta, faltando vários elementos relevantes.',
      insuficiente:
        'Não apresenta o enquadramento ou a informação é inexistente.',
    },
  },
  {
    id: 'objetivos',
    number: 2,
    name: 'Objetivos de Aprendizagem',
    weight: 0.20,
    weightPercent: 20,
    descriptors: {
      excelente:
        'Define objetivos claros, específicos e observáveis, alinhados com as aprendizagens pretendidas e adequados ao nível de ensino.',
      bom: 'Define objetivos pertinentes e adequados, embora alguns possam ser mais específicos ou observáveis.',
      satisfatorio:
        'Apresenta objetivos vagos, pouco claros ou parcialmente desadequados às aprendizagens pretendidas.',
      insuficiente:
        'Não apresenta objetivos de aprendizagem ou estes são desadequados à proposta.',
    },
  },
  {
    id: 'metodologia',
    number: 3,
    name: 'Metodologia Ativa',
    weight: 0.10,
    weightPercent: 10,
    descriptors: {
      excelente:
        'Identifica claramente a metodologia ativa predominante.',
      bom: 'Apresenta uma identificação pouco clara ou incorreta.',
      satisfatorio:
        'Apresenta uma identificação pouco clara ou incorreta.',
      insuficiente:
        'Não identifica a metodologia ativa.',
    },
  },
  {
    id: 'produto_final',
    number: 4,
    name: 'Produto Final dos Alunos',
    weight: 0.20,
    weightPercent: 20,
    descriptors: {
      excelente:
        'Descreve claramente o produto final ou a forma de aprendizagem pretendida, evidenciando a sua relevância curricular e o contributo da IA para as aprendizagens.',
      bom: 'Descreve adequadamente o produto final ou a aprendizagem pretendida, embora a sua articulação curricular ou o contributo da IA possam ser mais claros.',
      satisfatorio:
        'Apresenta uma descrição pouco desenvolvida, com fraca articulação curricular ou contributo pouco evidente da IA.',
      insuficiente:
        'Não descreve o produto final ou a forma de aprendizagem pretendida.',
    },
  },
  {
    id: 'sequencia',
    number: 5,
    name: 'Sequência Pedagógica e Tecnologias Utilizadas',
    weight: 0.40,
    weightPercent: 40,
    descriptors: {
      excelente:
        'Apresenta uma sequência pedagógica coerente e exequível, com momentos e duração definidos, papel mediador do professor, tarefas ativas dos alunos e identificação das ferramentas e da utilização da IA, quando aplicável.',
      bom: 'Apresenta uma sequência adequada, com os elementos solicitados, embora alguns momentos, ações, tempos ou utilizações tecnológicas careçam de maior clareza ou detalhe.',
      satisfatorio:
        'Apresenta uma sequência pouco articulada ou incompleta, com lacunas na definição dos momentos, tempos, ações do professor ou dos alunos e/ou tecnologias utilizadas.',
      insuficiente:
        'Não apresenta uma sequência pedagógica estruturada ou esta não permite compreender como se desenvolve a proposta.',
    },
  },
] as const;

export const CRITERIA = PROJECT_CRITERIA;

export const FEEDBACK_TEMPLATE_HTML =
  '<p>Olá,</p>' +
  '<p>O Projeto de Intervenção apresentado demonstra uma boa compreensão da atividade proposta.</p>' +
  '<p><strong>Pontos Fortes</strong></p>' +
  '<ul><li><strong>Pertinência e Contexto:</strong> Identifica claramente a necessidade educativa.</li>' +
  '<li><strong>Integração da IA:</strong> Ferramentas bem articuladas com o objetivo.</li></ul>' +
  '<p><strong>Aspetos a Melhorar</strong></p>' +
  '<ul><li>Detalhar como os utilizadores finais irão aplicar o recurso no terreno.</li></ul>' +
  '<p><strong>Recomendações</strong></p>' +
  '<ul><li>Incluir exemplos práticos de prompts ou fluxos de validação.</li></ul>' +
  '<p>Estou disponível para qualquer esclarecimento adicional.<br>A formadora, Carla Oliveira</p>';

export const SCENARIO_FEEDBACK_TEMPLATE_HTML =
  '<p>Olá,</p>' +
  '<p>O Cenário de Aprendizagem apresentado revela uma proposta bem estruturada e exequível em contexto de sala de aula.</p>' +
  '<p><strong>Pontos Fortes</strong></p>' +
  '<ul><li><strong>Enquadramento e Metodologia Ativa:</strong> Os objetivos estão bem alinhados com o ano de escolaridade e a metodologia ativa escolhida.</li>' +
  '<li><strong>Sequência Pedagógica e IA:</strong> A mediação do professor e o uso da IA pelos alunos são claros e adequados.</li></ul>' +
  '<p><strong>Aspetos a Melhorar</strong></p>' +
  '<ul><li>Clarificar a gestão do tempo ou o detalhe das tarefas dos alunos em algum momento da sequência.</li></ul>' +
  '<p><strong>Recomendações</strong></p>' +
  '<ul><li>Considerar momentos breves de reflexão crítica dos alunos sobre os resultados obtidos com a IA.</li></ul>' +
  '<p>Estou disponível para qualquer esclarecimento adicional.<br>A formadora, Carla Oliveira</p>';

export const ACTIVITIES: Record<ActivityType, ActivityConfig> = {
  projeto: {
    id: 'projeto',
    label: 'Projeto de Intervenção',
    shortLabel: 'Projeto de Intervenção',
    activityTitle: 'Projeto de Intervenção',
    titleFieldLabel: 'Nome do Projeto de Intervenção',
    titlePlaceholder: 'Ex: Assistente Documental para a Direção',
    audienceFieldLabel: 'Público-Alvo / Contexto de Intervenção',
    audienceShortLabel: 'Público-alvo',
    audiencePlaceholder: 'Ex: Direção, Departamentos, Biblioteca, Famílias',
    feedbackPlaceholder: 'Escreve aqui o feedback detalhado sobre o Projeto de Intervenção...',
    criteria: PROJECT_CRITERIA,
    templateHtml: FEEDBACK_TEMPLATE_HTML,
    csvSlug: 'projeto-intervencao',
  },
  cenario: {
    id: 'cenario',
    label: 'Cenário de Aprendizagem com a IA',
    shortLabel: 'Cenário de Aprendizagem',
    activityTitle: 'Cenário de Aprendizagem com a IA',
    titleFieldLabel: 'Tema / Título do Cenário de Aprendizagem',
    titlePlaceholder: 'Ex: Exploração Crítica de Fontes Históricas com IA',
    audienceFieldLabel: 'Disciplina e Ano de Escolaridade',
    audienceShortLabel: 'Disciplina / Ano',
    audiencePlaceholder: 'Ex: História · 8.º Ano',
    feedbackPlaceholder: 'Escreve aqui o feedback detalhado sobre o Cenário de Aprendizagem...',
    criteria: SCENARIO_CRITERIA,
    templateHtml: SCENARIO_FEEDBACK_TEMPLATE_HTML,
    csvSlug: 'cenario-aprendizagem',
  },
};

export const ACTIVITY_ORDER: readonly ActivityType[] = ['projeto', 'cenario'] as const;

export function getActivityConfig(activityType: ActivityType = 'projeto'): ActivityConfig {
  return ACTIVITIES[activityType] || ACTIVITIES.projeto;
}

export function getCriteriaForActivity(
  activityType: ActivityType = 'projeto'
): readonly CriterionDefinition[] {
  return getActivityConfig(activityType).criteria;
}

export function parseScore(value: ScoreInput | undefined): number | null {
  if (value === '' || value === null || value === undefined) return null;
  const num = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(num) || num < 0 || num > 10) return null;
  return num;
}

export function calcFinalScore(
  scores: readonly ScoreInput[] | undefined,
  activityType: ActivityType = 'projeto'
): string | null {
  const criteria = getCriteriaForActivity(activityType);
  if (!scores || scores.length !== criteria.length) return null;
  let total = 0;
  for (let i = 0; i < criteria.length; i += 1) {
    const parsed = parseScore(scores[i]);
    if (parsed === null) return null;
    total += parsed * criteria[i].weight;
  }
  return total.toFixed(2);
}

export function calcPartialWeighted(
  scores: readonly ScoreInput[] | undefined,
  activityType: ActivityType = 'projeto'
): number {
  const criteria = getCriteriaForActivity(activityType);
  if (!scores) return 0;
  let total = 0;
  for (let i = 0; i < criteria.length; i += 1) {
    const parsed = parseScore(scores[i]);
    if (parsed !== null) {
      total += parsed * criteria[i].weight;
    }
  }
  return Number(total.toFixed(2));
}

export function getPerformanceLevel(score: number): PerformanceLevel {
  if (score >= 9.5) return PERFORMANCE_LEVELS[0];
  if (score >= 7) return PERFORMANCE_LEVELS[1];
  if (score >= 1) return PERFORMANCE_LEVELS[2];
  return PERFORMANCE_LEVELS[3];
}

export function getCriterionLevelKey(score: number): PerformanceLevelKey {
  return getPerformanceLevel(score).key;
}

const PWD_PREFIXES = [
  'Azul',
  'Verde',
  'Solar',
  'Luna',
  'Vento',
  'Mar',
  'Rio',
  'Alto',
  'Bosque',
  'Nuvem',
];

export function generateStudentPassword(): string {
  const prefix = PWD_PREFIXES[Math.floor(Math.random() * PWD_PREFIXES.length)];
  const num = Math.floor(10 + Math.random() * 90);
  return `${prefix}${num}`;
}

export function getInitials(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return 'F';
  return parts
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function sanitizeFeedbackHtml(rawHtml: string): string {
  if (!rawHtml) return '';
  let cleaned = rawHtml
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
    .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, '')
    .replace(/<o:p>[\s\S]*?<\/o:p>/gi, '')
    .replace(/\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/href\s*=\s*(?:"javascript:[^"]*"|'javascript:[^']*')/gi, 'href="#"')
    .replace(/href\s*=\s*(?:"file:\/\/[^"]*"|'file:\/\/[^']*')/gi, 'href="#"');

  cleaned = cleaned.trim();
  return cleaned;
}
