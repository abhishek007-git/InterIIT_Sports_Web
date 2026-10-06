import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { PdfService } from '../pdf/pdf.service.js';

type FixtureRow = {
  stage: string;
  venue: { name: string };
  confirmedResult: { value: string } | null;
  fixtureStandings: { rank: number; points: number; institution: { name: string }; participant: { name: string } | null }[];
};
type DisciplineRow = { name: string; fixtures: FixtureRow[] };
type SportWithData = { name: string; disciplines: DisciplineRow[] };

@Injectable()
export class ReportsService {
  constructor(
    private prisma: PrismaService,
    private pdfService: PdfService,
  ) {}

  async generateSportReport(sportId: string): Promise<Buffer> {
    const sport = await this.prisma.sport.findUnique({
      where: { id: sportId },
      include: {
        disciplines: {
          include: {
            fixtures: {
              include: {
                venue: true,
                confirmedResult: true,
                fixtureStandings: { include: { institution: true, participant: true }, orderBy: { rank: 'asc' } },
              },
              orderBy: { scheduledAt: 'asc' },
            },
          },
        },
      },
    });

    if (!sport) {
      throw new NotFoundException('Sport not found');
    }

    const html = this.buildHtml(sport);
    return this.pdfService.renderHtmlToPdf(html);
  }

  private buildHtml(sport: SportWithData): string {
    const sections = sport.disciplines
      .map((discipline) => {
        const fixtureRows = discipline.fixtures
          .map((fixture) => {
            const standingsRows = fixture.fixtureStandings
              .map((s) => `<tr><td>${s.rank}</td><td>${s.participant ? s.participant.name : '—'}</td><td>${s.institution.name}</td><td>${s.points}</td></tr>`)
              .join('');
            return `
              <h3>${fixture.stage} — ${fixture.venue.name}</h3>
              <p>Result: ${fixture.confirmedResult ? fixture.confirmedResult.value : 'Not confirmed'}</p>
              ${standingsRows ? `<table><thead><tr><th>Rank</th><th>Participant</th><th>Institution</th><th>Points</th></tr></thead><tbody>${standingsRows}</tbody></table>` : '<p>No standings recorded.</p>'}
            `;
          })
          .join('');
        return `<h2>${discipline.name}</h2>${fixtureRows}`;
      })
      .join('');

    return `
<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: Arial, sans-serif; padding: 40px; }
  h1 { color: #1a1a2e; border-bottom: 3px solid #1a1a2e; padding-bottom: 10px; }
  h2 { color: #16213e; margin-top: 30px; }
  h3 { color: #333; margin-top: 20px; margin-bottom: 5px; }
  table { border-collapse: collapse; width: 100%; margin-bottom: 15px; }
  th, td { border: 1px solid #ccc; padding: 6px 10px; text-align: left; font-size: 14px; }
  th { background: #f0f0f0; }
</style>
</head>
<body>
  <h1>${sport.name} — Full Report</h1>
  ${sections}
</body>
</html>`;
  }
}