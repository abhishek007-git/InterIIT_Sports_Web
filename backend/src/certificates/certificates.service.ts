import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { PdfService } from '../pdf/pdf.service.js';

function ordinal(n: number): string {
  const j = n % 10;
  const k = n % 100;
  if (j === 1 && k !== 11) return `${n}st`;
  if (j === 2 && k !== 12) return `${n}nd`;
  if (j === 3 && k !== 13) return `${n}rd`;
  return `${n}th`;
}

@Injectable()
export class CertificatesService {
  constructor(
    private prisma: PrismaService,
    private pdfService: PdfService,
  ) {}

  async generate(participantId: string, fixtureId: string): Promise<Buffer> {
    const standing = await this.prisma.fixtureStanding.findFirst({
      where: { participantId, fixtureId },
      include: {
        participant: true,
        institution: true,
        fixture: { include: { discipline: { include: { sport: true } } } },
      },
    });

    if (!standing) {
      throw new NotFoundException('No standing recorded for this participant in this fixture');
    }

    const html = this.buildHtml(standing);
    return this.pdfService.renderHtmlToPdf(html);
  }

  private buildHtml(standing: {
    participant: { name: string } | null;
    institution: { name: string } | null;
    rank: number;
    fixture: { discipline: { name: string; sport: { name: string } } };
  }): string {
    const participantName = standing.participant?.name ?? 'Unknown participant';
    const institutionName = standing.institution?.name ?? 'Unknown institution';

    return `
<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: Georgia, serif; text-align: center; padding: 60px; }
  .border { border: 8px double #b8860b; padding: 50px; }
  h1 { font-size: 42px; color: #b8860b; margin-bottom: 0; }
  .subtitle { font-size: 18px; color: #555; margin-top: 5px; }
  .name { font-size: 32px; margin: 30px 0 10px; font-weight: bold; }
  .detail { font-size: 20px; margin: 10px 0; }
  .rank { font-size: 26px; color: #b8860b; font-weight: bold; margin-top: 20px; }
</style>
</head>
<body>
  <div class="border">
    <h1>Certificate of Achievement</h1>
    <p class="subtitle">Sports Meet Platform</p>
    <p class="detail">This certifies that</p>
    <p class="name">${participantName}</p>
    <p class="detail">representing ${institutionName}</p>
    <p class="detail">has achieved</p>
    <p class="rank">${ordinal(standing.rank)} Place</p>
    <p class="detail">in ${standing.fixture.discipline.name} (${standing.fixture.discipline.sport.name})</p>
  </div>
</body>
</html>`;
  }
}