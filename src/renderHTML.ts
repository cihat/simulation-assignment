import type { Computer } from './types';
import humanizeDuration from 'humanize-duration';
import { TIME } from './constans';

export default function renderHTML(computers: Array<Computer>): void {
  const infosContainerSelector: HTMLElement = document.getElementById(
    'infos_container',
  ) as HTMLElement;
  const getLastItem = computers[computers.length - 1];
  const diff = getLastItem.finish_time - TIME;

  infosContainerSelector.innerHTML = `
    <div class="info">
      <p>
        <div>
        <span>
          <strong>Ortalama Gelen Musteri Sayisi: </strong>
        </span>
          <strong>${computers.length}</strong>
        </div>
        <span>
        <span>
          <strong>Ortalama Kuyruktaki Musteri Sayisi: </strong>
        </span>
          <strong>${
            computers.filter((computer) => computer.status == 'broken').length
          }</strong>
        </span>
        <span>
        <div>
          <span>
            <strong>Sorunu tespit edilen bilgisayar sayisi: </strong>
          </span>
          <strong>${
            computers.filter((computer) => computer.status == 'fixed').length
          }</strong>
        </span>
        </div>
        <div>
          <span>
            <strong>Asan Sure: </strong>
          </span>
        <strong>${humanizeDuration(diff, { language: 'tr' })}</strong>
      </span>
      </div>
  
      <div>
        <span>
          <strong>Toplan Gecen Sure: </strong>
        </span>
        <strong>${humanizeDuration(
          computers[computers.length - 1].finish_time,
          { language: 'tr' },
        )}</strong>
        </span>
      </div>
  
  
      </p>
    </div>
    
    `;
}
