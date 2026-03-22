export function renderProposal(proposal, name, showProposal) {
  const screen = document.getElementById(proposal.id);
  const h1 = screen.querySelector('h1');
  const p = screen.querySelector('p');
  const btnDiv = screen.querySelector('.btn');

  // Заполняем заголовок и текст
  h1.textContent = proposal.title.replace('{name}', name);
  p.textContent = proposal.text.replace('{name}', name);

  // Обрабатываем кнопки
  if (btnDiv) {
    btnDiv.innerHTML = '';
    proposal.buttons.forEach(button => {
      const a = document.createElement('a');
      a.href = '#';
      a.textContent = button.text;
      if (button.id) a.id = button.id;
      if (button.action.startsWith('showProposal')) {
        const id = button.action.match(/'([^']+)'/)[1];
        a.onclick = () => showProposal(id);
      }
      btnDiv.appendChild(a);
    });
  }

  // --- Обёртка h1, p, btn в общий блок .text-card ---
  // Проверяем, не обёрнуты ли уже (чтобы не дублировать при повторном рендере)
  let textCard = screen.querySelector('.text-card');
  if (!textCard) {
    // Создаём карточку
    textCard = document.createElement('div');
    textCard.className = 'text-card';
    // Перемещаем h1, p, btnDiv внутрь карточки
    const elementsToWrap = [h1, p];
    if (btnDiv) elementsToWrap.push(btnDiv);
    // Удаляем элементы из текущего места
    elementsToWrap.forEach(el => {
      if (el && el.parentNode === screen) {
        screen.removeChild(el);
      }
    });
    // Добавляем их в карточку в том же порядке
    elementsToWrap.forEach(el => {
      if (el) textCard.appendChild(el);
    });
    // Вставляем карточку в screen (после стикера, но до остального контента)
    const stickerDiv = screen.querySelector('.sticker');
    if (stickerDiv && stickerDiv.nextSibling) {
      screen.insertBefore(textCard, stickerDiv.nextSibling);
    } else {
      screen.appendChild(textCard);
    }
  }

  // --- Добавляем love-letter блок для proposal-yes (если есть данные) ---
  if (proposal.id === 'proposal-yes') {
    // Удаляем предыдущий контейнер, если был
    const oldContainer = screen.querySelector('.love-letter-container');
    if (oldContainer) oldContainer.remove();

    // Создаём контейнер
    const loveContainer = document.createElement('div');
    loveContainer.className = 'love-letter-container';

    // Текст признания
    if (proposal.loveText) {
      const textDiv = document.createElement('div');
      textDiv.className = 'love-text';
      const pText = document.createElement('p');
      pText.textContent = proposal.loveText.replace(/{name}/g, name);
      textDiv.appendChild(pText);
      loveContainer.appendChild(textDiv);
    }

    // Видео
    if (proposal.videoUrl) {
      const videoWrapper = document.createElement('div');
      videoWrapper.className = 'video-wrapper';
      let videoElement;

      if (proposal.videoUrl.includes('youtube.com/embed')) {
        videoElement = document.createElement('iframe');
        videoElement.src = proposal.videoUrl;
        videoElement.width = "560";
        videoElement.height = "315";
        videoElement.frameBorder = "0";
        videoElement.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        videoElement.allowFullscreen = true;
      } else {
        videoElement = document.createElement('video');
        videoElement.controls = true;
        videoElement.src = proposal.videoUrl;
        videoElement.style.maxWidth = "100%";
        videoElement.style.borderRadius = "15px";
      }

      videoWrapper.appendChild(videoElement);
      loveContainer.appendChild(videoWrapper);
    }

    // Вставляем loveContainer после text-card
    const textCardEl = screen.querySelector('.text-card');
    if (textCardEl && textCardEl.nextSibling) {
      screen.insertBefore(loveContainer, textCardEl.nextSibling);
    } else {
      screen.appendChild(loveContainer);
    }
  }
}