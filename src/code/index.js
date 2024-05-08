console.log("Social Repo opened!");

document.addEventListener("DOMContentLoaded", function () {
  const editButton = document.getElementById("edit-button");
  const editPanel = document.getElementById("edit");
  const copyIcons = document.querySelectorAll(".copy-icon");
  const inputField = document.querySelector(".social-media-info input");
  const list = document.getElementById("social-media-list");
  const dragItems = Array.from(document.querySelectorAll(".draggable-item"));

  // toast message
  const toast = document.createElement("section");
  toast.classList.add("toast");
  document.body.appendChild(toast);

  editButton.addEventListener("click", function () {
    const isHidden = editPanel.classList.contains("hidden");

    if (isHidden) {
      editPanel.classList.remove("hidden");
      editButton.classList.add("active");
    } else {
      editPanel.classList.add("hidden");
      editButton.classList.remove("active");
    }
  });

  copyIcons.forEach((el) => {
    el.addEventListener("click", () => {
      if (inputField) {
        navigator.clipboard
          .writeText(inputField.value)
          .then(() => {
            showToast("Link copied to clipboard!");
          })
          .catch((err) => {
            console.error("Could not copy text: ", err);
          });
      }
    });
  });

  // Toast message
  function showToast(message) {
    let toastTimer;
    toast.innerText = message;
    toast.classList.add("show");

    if (!toastTimer) {
      toastTimer = setTimeout(() => {
        toast.classList.remove("show");
      }, 2000); /* Show the toast for 2 seconds */
    }
  }

  // DRAG AND DROP
  let draggedItem = null;
  let dropTarget = null;

  // Add event listeners to each draggable item
  dragItems.forEach((item) => {
    item.addEventListener("dragstart", handleDragStart);
    item.addEventListener("dragover", handleDragOver);
    item.addEventListener("dragenter", handleDragEnter);
    item.addEventListener("dragleave", handleDragLeave);
    item.addEventListener("drop", handleDrop);
    item.addEventListener("dragend", handleDragEnd);
  });

  function handleDragStart(e) {
    draggedItem = e.target.closest(".draggable-item");
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", ""); // Required to enable dragging
  }

  function handleDragOver(e) {
    e.preventDefault(); // Allow dropping
  }

  function handleDragEnter(e) {
    e.preventDefault(); // Allow drop and add visual cues

    const newDropTarget = e.target.closest(".draggable-item");
    if (newDropTarget && newDropTarget !== draggedItem) {
      if (dropTarget) {
        dropTarget.classList.remove("drag-over-top", "drag-over-bottom");
      }

      const dropPosition = determineDropPosition(e, newDropTarget);
      newDropTarget.classList.add(
        dropPosition === "top" ? "drag-over-top" : "drag-over-bottom"
      );
      dropTarget = newDropTarget;
    }
  }

  function handleDragLeave(e) {
    const item = e.target.closest(".draggable-item");
    if (item && item === dropTarget) {
      dropTarget.classList.remove("drag-over-top", "drag-over-bottom");
    }
  }

  function handleDrop(e) {
    e.preventDefault(); // Prevent default drop behavior

    const dropPosition = determineDropPosition(e, dropTarget);
    if (dropTarget && dropTarget !== draggedItem) {
      if (dropPosition === "top") {
        list.insertBefore(draggedItem, dropTarget);
      } else {
        list.insertBefore(draggedItem, dropTarget.nextSibling);
      }
    }

    // Clean up visual cues after dropping
    if (dropTarget) {
      dropTarget.classList.remove("drag-over-top", "drag-over-bottom");
      dropTarget = null;
    }
  }

  function handleDragEnd(e) {
    // Clear dragging item and visual cues
    if (draggedItem) {
      draggedItem.classList.remove("dragging");
      draggedItem = null;
    }
  }

  function determineDropPosition(event, dropTarget) {
    const rect = dropTarget.getBoundingClientRect();
    const middleY = rect.top + rect.height / 2;
    return event.clientY < middleY ? "top" : "bottom"; // Determine insert position
  }
});
