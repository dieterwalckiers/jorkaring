import {
  ElementNode,
  type DOMConversionMap,
  type EditorConfig,
  type LexicalNode,
  type LexicalUpdateJSON,
  type SerializedElementNode,
} from 'lexical'

export type SerializedBlockGroupNode = SerializedElementNode

/**
 * A block-level container that wraps a group of selected blocks (paragraphs,
 * headings, lists, …) so they can be styled as a single box — background tint,
 * hairline border, inset padding, text color.
 *
 * Styling is stored as Lexical NodeState on this node (the shared block-style
 * state configs), which auto-serializes under the `$` key and round-trips
 * through Payload. The frontend renders it as a single `<div class="block-group …">`.
 */
export class BlockGroupNode extends ElementNode {
  static getType(): string {
    return 'blockgroup'
  }

  static clone(node: BlockGroupNode): BlockGroupNode {
    return new BlockGroupNode(node.__key)
  }

  static importJSON(serializedNode: SerializedBlockGroupNode): BlockGroupNode {
    return $createBlockGroupNode().updateFromJSON(serializedNode)
  }

  static importDOM(): DOMConversionMap | null {
    return null
  }

  createDOM(_config: EditorConfig): HTMLElement {
    const dom = document.createElement('div')
    dom.className = 'block-group'
    return dom
  }

  updateDOM(): boolean {
    return false
  }

  exportJSON(): SerializedBlockGroupNode {
    return {
      ...super.exportJSON(),
      type: BlockGroupNode.getType(),
      version: 1,
    }
  }

  updateFromJSON(serializedNode: LexicalUpdateJSON<SerializedBlockGroupNode>): this {
    return super.updateFromJSON(serializedNode)
  }

  // A box with no content shouldn't linger — let Lexical clean it up.
  canBeEmpty(): boolean {
    return false
  }

  canIndent(): boolean {
    return false
  }

  isInline(): boolean {
    return false
  }

  isShadowRoot(): boolean {
    return false
  }
}

export function $createBlockGroupNode(): BlockGroupNode {
  return new BlockGroupNode()
}

export function $isBlockGroupNode(
  node: LexicalNode | null | undefined,
): node is BlockGroupNode {
  return node instanceof BlockGroupNode
}
