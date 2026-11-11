import { useEffect, useRef, useState, type FormEvent } from 'react'
import Lenis from 'lenis'
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, BarChart3, Check, ChevronDown,
  ArrowLeftRight, BadgeCheck, ChartNoAxesCombined, CircleDollarSign, ClipboardCheck,
  FileCheck2, FilePenLine, FileSearch, Files, GitCompareArrows, Landmark, ListChecks,
  LoaderCircle, Menu, ReceiptText, Scale, ScanSearch, ShieldCheck, Sparkles,
  UserRoundCheck, X,
} from 'lucide-react'

const solutions = [
  { icon: BarChart3, title: 'Budget review', text: 'Bring budgets, assumptions and supporting documents into one reviewable process.' },
  { icon: Landmark, title: 'Escrow audit', text: 'Organise evidence and checks across escrow activity with a clear trail for review.' },
  { icon: ClipboardCheck, title: 'Financial audit', text: 'Prepare the repetitive work around audit evidence so professionals can focus on judgement.' },
  { icon: FileCheck2, title: 'Interim audit', text: 'Keep interim testing and working papers moving with a more consistent workflow.' },
  { icon: CircleDollarSign, title: 'Property budgets', text: 'Support budget preparation for property management companies.' },
]

const tools = [
  ['PO', 'Purchase-order extraction', 'Pull key details from purchase orders into a reviewable draft.'],
  ['VA', 'Vouching automation', 'Prepare document checks and supporting schedules for vouching.'],
  ['EW', 'Expense working', 'Reduce repetitive steps in expense working papers.'],
  ['FR', 'Financial report review', 'Check reports for gaps, mismatches and items that need attention.'],
  ['TV', 'Tender verification', 'Compare tender documents against agreed requirements.'],
  ['RC', 'Reconciliation', 'Match records and surface differences for professional review.'],
]

const capabilities = [
  { icon: FileSearch, title: 'Read documents', text: 'Extract figures and details from invoices, purchase orders, contracts and statements.', label: 'SOURCE DETAILS', sample: 'Purchase order · PO-1048', detail: 'Supplier · Amount · Date · Line items', result: 'Details prepared for checking' },
  { icon: Scale, title: 'Compare and match', text: 'Check documents against ledgers, or compare quotes and supporting records.', label: 'MATCH REVIEW', sample: 'Invoice total · AED 5,600', detail: 'Ledger total · AED 5,360', result: 'AED 240 difference to review' },
  { icon: ShieldCheck, title: 'Check against rules', text: 'Surface missing items, mismatched totals, duplicates and values outside agreed limits.', label: 'RULE VALIDATION', sample: 'Required fields · Complete', detail: 'Duplicate check · No match found', result: 'One variance flagged for review' },
  { icon: FileCheck2, title: 'Prepare draft work', text: 'Assemble schedules, working papers and reports as drafts for a professional to review.', label: 'WORKING PAPER', sample: 'Expense review · April', detail: 'Evidence · Checks · Exceptions', result: 'Draft ready for professional review' },
  { icon: Files, title: 'Handle bulk work', text: 'Process hundreds of documents in one batch while keeping exceptions visible.', label: 'BATCH OVERVIEW', sample: 'Documents received', detail: 'Grouped · Extracted · Checked', result: 'Batch summary prepared for review' },
]

const steps = [
  { number: '01', title: 'Bring documents together', text: 'Invoices, orders, contracts and statements enter one organised workflow.', icon: Files },
  { number: '02', title: 'Extract and compare', text: 'Key details are read, matched against records and checked against agreed rules.', icon: FileSearch },
  { number: '03', title: 'Prepare the work', text: 'Schedules, working papers and reports are assembled as drafts for review.', icon: Scale },
  { number: '04', title: 'A professional decides', text: 'People review the evidence, resolve exceptions and give the final sign-off.', icon: ShieldCheck },
]

const liveFrames = [
  {
    documents: 128, matched: 124, attention: '04', progress: '97%', alert: 'One item needs a closer look', detail: 'Difference found against the ledger', rows: [
      ['Utilities · April.pdf', 'Invoice · 2 pages', 'AED 8,420', 'Matched'],
      ['Maintenance · 014.pdf', 'Purchase order · 1 page', 'AED 3,180', 'Matched'],
      ['Cleaning · April.pdf', 'Invoice · 3 pages', 'AED 5,600', 'Review item'],
    ]
  },
  {
    documents: 129, matched: 125, attention: '04', progress: '98%', alert: 'PO match confirmed', detail: 'Maintenance · 014.pdf is ready', rows: [
      ['Utilities · April.pdf', 'Invoice · 2 pages', 'AED 8,420', 'Matched'],
      ['Maintenance · 014.pdf', 'Purchase order · 1 page', 'AED 3,180', 'Matched'],
      ['Cleaning · April.pdf', 'Invoice · 3 pages', 'AED 5,600', 'Review item'],
    ]
  },
  {
    documents: 130, matched: 125, attention: '05', progress: '98%', alert: 'New variance flagged', detail: 'Cleaning · April.pdf · AED 240 difference', rows: [
      ['Utilities · April.pdf', 'Invoice · 2 pages', 'AED 8,420', 'Matched'],
      ['Maintenance · 014.pdf', 'Purchase order · 1 page', 'AED 3,180', 'Matched'],
      ['Cleaning · April.pdf', 'Invoice · 3 pages', 'AED 5,600', 'Review item'],
    ]
  },
  {
    documents: 131, matched: 126, attention: '05', progress: '99%', alert: 'Draft schedule updated', detail: 'Prepared for professional review', rows: [
      ['Utilities · April.pdf', 'Invoice · 2 pages', 'AED 8,420', 'Matched'],
      ['Maintenance · 014.pdf', 'Purchase order · 1 page', 'AED 3,180', 'Matched'],
      ['Cleaning · April.pdf', 'Invoice · 3 pages', 'AED 5,600', 'Review item'],
    ]
  },
]

const activityLabels = [
  'Extracting line items',
  'Matching ledger entries',
  'Checking totals against source',
  'Scanning for duplicate records',
  'Preparing review schedule',
]

const faqs = [
  { question: 'Does AVERIQ make final financial decisions?', answer: 'No. AVERIQ’ stated approach is that software prepares the work and the professional reviews and decides. Final review and sign-off remain with people.' },
  { question: 'What kinds of work can the software help prepare?', answer: 'The assignment describes document extraction, comparison and matching, rule-based checks, exception detection, and draft schedules, working papers and reports.' },
  { question: 'Are all products currently available?', answer: 'The brief says some offerings are already in use and others are in development. Availability depends on the specific product.' },
  { question: 'Is AVERIQ an accounting or audit firm?', answer: 'The assignment describes AVERIQ as a software company that emerged from the technology department of Alkazim, an accounting and audit firm. AVERIQ’ listed offerings are software products and automation solutions.' },
  { question: 'Who is the software designed for?', answer: 'The brief identifies accountants, auditors, finance teams and property management companies as the audiences for AVERIQ’ products.' },
]

const marqueeItems = [
  { label: 'Budget review', icon: ChartNoAxesCombined },
  { label: 'Escrow audit', icon: Landmark },
  { label: 'Financial audit', icon: ClipboardCheck },
  { label: 'Interim audit', icon: FileCheck2 },
  { label: 'Purchase-order extraction', icon: FileSearch },
  { label: 'Vouching', icon: ScanSearch },
  { label: 'Expense working', icon: ReceiptText },
  { label: 'Financial report review', icon: Files },
  { label: 'Tender verification', icon: BadgeCheck },
  { label: 'Reconciliation', icon: ArrowLeftRight },
]
const processMarqueeItems = [
  { label: 'Read source documents', icon: Files },
  { label: 'Compare and match', icon: GitCompareArrows },
  { label: 'Check against rules', icon: ListChecks },
  { label: 'Prepare draft work', icon: FilePenLine },
  { label: 'Professional review', icon: UserRoundCheck },
]

const applications = [
  { number: '01', title: 'Financial audit', text: 'Bring evidence, repeatable checks and working papers into a process that stays ready for professional review.', art: 'audit' },
  { number: '02', title: 'Purchase-order extraction', text: 'Prepare key purchase-order details in a structured draft, so a professional can check the source and context.', art: 'extract' },
  { number: '03', title: 'Budget review', text: 'Bring budgets, assumptions and supporting documents together for a clearer review process.', art: 'budget' },
]

function ProcessSketch({ variant }: { variant: string }) {
  return (
    <svg className={`process-sketch sketch-${variant}`} viewBox="0 0 520 300" aria-hidden="true">
      <path className="sketch-grid" d="M32 64h456M32 112h456M32 160h456M32 208h456M80 32v236M176 32v236M272 32v236M368 32v236M464 32v236" />
      <path className="sketch-axis" d="M72 226 168 176 264 190 360 124 448 82" />
      <path className="sketch-flow" d="M72 226 168 176 264 190 360 124 448 82" />
      <path className="sketch-box" d="M44 221h56v24H44zM140 171h56v24h-56zM236 185h56v24h-56zM332 119h56v24h-56zM420 77h56v24h-56z" />
      <path className="sketch-box secondary" d="M104 86h92v48h-92zM212 86h92v48h-92zM320 86h92v20h-92z" />
      <path className="sketch-connector" d="M150 134v24m108-24v44m108-38v-18" />
      <circle className="sketch-node node-a" cx="72" cy="226" r="5" />
      <circle className="sketch-node node-b" cx="168" cy="176" r="5" />
      <circle className="sketch-node node-c" cx="264" cy="190" r="5" />
      <circle className="sketch-node node-d" cx="360" cy="124" r="5" />
      <circle className="sketch-node node-e" cx="448" cy="82" r="5" />
      <text x="120" y="106">SOURCE</text><text x="236" y="106">CHECKS</text><text x="344" y="100">DRAFT</text>
    </svg>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuClosing, setMenuClosing] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [legalDocument, setLegalDocument] = useState<'privacy' | 'terms' | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [liveFrame, setLiveFrame] = useState(0)
  const [activityIndex, setActivityIndex] = useState(0)
  const [activeCapability, setActiveCapability] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [demoLoading, setDemoLoading] = useState(false)
  const [headerScrolled, setHeaderScrolled] = useState(false)
  const progressRef = useRef<HTMLDivElement>(null)
  const solutionStageRef = useRef<HTMLDivElement>(null)
  const solutionTrackRef = useRef<HTMLDivElement>(null)
  const solutionRailProgressRef = useRef<HTMLSpanElement>(null)
  const solutionRailHeadRef = useRef<HTMLSpanElement>(null)
  const lenisRef = useRef<Lenis | null>(null)
  const [activeSolution, setActiveSolution] = useState(0)
  const frame = liveFrames[liveFrame]
  const activeCapabilityData = capabilities[activeCapability]
  const ActiveCapabilityIcon = activeCapabilityData.icon
  const activeStep = activityIndex === 0 ? 0 : activityIndex === 1 ? 1 : activityIndex < 4 ? 2 : 3

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      infinite: false,
    })

    lenisRef.current = lenis
    ;(window as unknown as { lenis: Lenis }).lenis = lenis

    let rafId: number
    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    lenis.on('scroll', (e: { scroll: number; progress: number }) => {
      const scrolled = e.scroll > 32
      setHeaderScrolled((prev) => (prev !== scrolled ? scrolled : prev))
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${e.progress})`
      }
    })

    const handleAnchorClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a')
      if (!anchor) return
      const href = anchor.getAttribute('href')
      if (href && href.startsWith('#')) {
        e.preventDefault()
        setMenuOpen(false)
        if (href === '#top' || href === '#') {
          lenis.scrollTo(0, { duration: 1.15 })
        } else {
          const target = document.querySelector(href)
          if (target) {
            lenis.scrollTo(target as HTMLElement, { offset: -70, duration: 1.15 })
          }
        }
      }
    }
    document.addEventListener('click', handleAnchorClick)

    return () => {
      cancelAnimationFrame(rafId)
      document.removeEventListener('click', handleAnchorClick)
      lenis.destroy()
      lenisRef.current = null
      delete (window as unknown as { lenis?: Lenis }).lenis
    }
  }, [])

  useEffect(() => {
    if (!lenisRef.current) return
    if (modalOpen || legalDocument) {
      lenisRef.current.stop()
    } else {
      lenisRef.current.start()
    }
  }, [modalOpen, legalDocument])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const frameTimer = window.setInterval(() => setLiveFrame((current) => (current + 1) % liveFrames.length), 3000)
    const activityTimer = window.setInterval(() => setActivityIndex((current) => (current + 1) % activityLabels.length), 1050)
    return () => { window.clearInterval(frameTimer); window.clearInterval(activityTimer) }
  }, [])

  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>(
      '.editorial-heading, .application-card, #solutions .section-heading, .solution-point-copy, .tools-heading, .tool-row, #capabilities .section-heading, .capability-choice, .capability-console, .workflow-intro, .workflow-step, .human-note, .comparison-section .section-heading, .comparison-card, .about-layout > *, .faq-heading, .faq-item, .cta-inner > *',
    )
    if (!('IntersectionObserver' in window)) return
    targets.forEach((target) => target.classList.add('scroll-reveal'))
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target.matches('.tool-row')) {
          entry.target.classList.toggle('is-visible', entry.isIntersecting)
          return
        }
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' })
    targets.forEach((target) => observer.observe(target))

    const supportsGlow = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const magneticTargets = supportsGlow
      ? [...document.querySelectorAll<HTMLElement>('.nav-cta, .hero-actions .button')]
      : []
    const moveMagneticTarget = (event: PointerEvent) => {
      const target = event.currentTarget as HTMLElement
      const rect = target.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      const nx = x / rect.width - 0.5
      const ny = y / rect.height - 0.5
      const dx = nx * 10
      const dy = ny * 10
      target.style.setProperty('--pointer-x', `${x}px`)
      target.style.setProperty('--pointer-y', `${y}px`)
      target.style.setProperty('--mag-x', `${dx.toFixed(1)}px`)
      target.style.setProperty('--mag-y', `${dy.toFixed(1)}px`)
      target.style.setProperty('--tilt-x', `${(nx * 7).toFixed(2)}deg`)
      target.style.setProperty('--tilt-y', `${(-ny * 7).toFixed(2)}deg`)
    }
    const resetMagneticTarget = (event: PointerEvent) => {
      const target = event.currentTarget as HTMLElement
      target.style.setProperty('--mag-x', '0px')
      target.style.setProperty('--mag-y', '0px')
      target.style.setProperty('--tilt-x', '0deg')
      target.style.setProperty('--tilt-y', '0deg')
    }
    magneticTargets.forEach((target) => {
      target.addEventListener('pointermove', moveMagneticTarget)
      target.addEventListener('pointerleave', resetMagneticTarget)
    })
    let frameId = 0
    const updateProgress = () => {
      if (lenisRef.current) return
      const scrolled = window.scrollY > 32
      setHeaderScrolled((prev) => (prev !== scrolled ? scrolled : prev))
      cancelAnimationFrame(frameId)
      frameId = requestAnimationFrame(() => {
        const range = document.documentElement.scrollHeight - window.innerHeight
        const progress = range > 0 ? window.scrollY / range : 0
        if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`
      })
    }
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress)
    updateProgress()
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frameId)
      magneticTargets.forEach((target) => {
        target.removeEventListener('pointermove', moveMagneticTarget)
        target.removeEventListener('pointerleave', resetMagneticTarget)
      })
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [])

  const closeMenu = () => { if (!menuOpen || menuClosing) return; setMenuClosing(true); window.setTimeout(() => { setMenuOpen(false); setMenuClosing(false) }, 280) }

  const scrollSolutions = (direction: number) => {
    const element = solutionTrackRef.current
    if (!element) return
    const points = element.querySelectorAll<HTMLElement>('.solution-point')
    const target = points[Math.max(0, Math.min(points.length - 1, activeSolution + direction))]
    const marker = target?.querySelector<HTMLElement>('.solution-point-marker')
    const currentMarker = points[activeSolution]?.querySelector<HTMLElement>('.solution-point-marker')
    if (!marker || !currentMarker) return
    const markerCenter = marker.getBoundingClientRect().left + marker.offsetWidth / 2
    const currentCenter = currentMarker.getBoundingClientRect().left + currentMarker.offsetWidth / 2
    const delta = markerCenter - currentCenter
    if (lenisRef.current) {
      lenisRef.current.scrollTo(window.scrollY + delta, { duration: 0.9 })
    } else {
      window.scrollBy({ top: delta, behavior: 'smooth' })
    }
  }
  useEffect(() => {
    const stage = solutionStageRef.current
    const viewport = solutionTrackRef.current
    const track = viewport?.querySelector<HTMLElement>('.solution-track')
    if (!stage || !viewport || !track) return
    let travel = 0
    let stickyTop = 0
    let viewportWidth = 0
    let pointData: { point: HTMLElement; markerLeft: number; lineArrival: number }[] = []
    let frame = 0

    const measure = () => {
      travel = Math.max(0, track.scrollWidth - viewport.clientWidth)
      viewportWidth = viewport.clientWidth
      stickyTop = Number.parseFloat(getComputedStyle(viewport.parentElement as HTMLElement).top) || 0
      const timelineHeight = viewport.parentElement?.offsetHeight ?? viewport.offsetHeight
      stage.style.height = `${timelineHeight + travel}px`

      const trackRect = track.getBoundingClientRect()
      pointData = Array.from(track.querySelectorAll<HTMLElement>('.solution-point')).map((point) => {
        const marker = point.querySelector<HTMLElement>('.solution-point-marker')
        const markerLeft = marker ? marker.getBoundingClientRect().left + marker.offsetWidth / 2 - trackRect.left : 0
        return {
          point,
          markerLeft,
          lineArrival: track.scrollWidth ? markerLeft / track.scrollWidth : 0,
        }
      })
    }

    const sync = () => {
      const stageTop = stage.getBoundingClientRect().top
      const progress = travel > 0 ? Math.max(0, Math.min(1, (stickyTop - stageTop) / travel)) : 0
      track.style.transform = `translate3d(${-travel * progress}px, 0, 0)`
      const railStart = travel * progress
      const railDistance = viewportWidth * progress
      if (solutionRailProgressRef.current) {
        solutionRailProgressRef.current.style.left = `${railStart}px`
        solutionRailProgressRef.current.style.width = `${railDistance}px`
      }
      if (solutionRailHeadRef.current) solutionRailHeadRef.current.style.left = `${railStart + railDistance}px`

      const currentTrackX = -travel * progress
      const viewportCenter = viewportWidth / 2
      let closest = 0
      let closestDist = Number.POSITIVE_INFINITY

      pointData.forEach(({ point, markerLeft, lineArrival }, index) => {
        const drawProgress = Math.max(0, Math.min(1, (progress - lineArrival + 0.04) / 0.04))
        point.style.setProperty('--connector-progress', drawProgress.toFixed(3))

        const markerScreenX = markerLeft + currentTrackX
        const dist = Math.abs(markerScreenX - viewportCenter)
        if (dist < closestDist) {
          closestDist = dist
          closest = index
        }
      })
      setActiveSolution((current) => (current === closest ? current : closest))
    }

    const scheduleSync = () => {
      if (frame) return
      frame = requestAnimationFrame(() => { frame = 0; sync() })
    }
    const refresh = () => { measure(); scheduleSync() }
    refresh()

    const lenis = lenisRef.current
    if (lenis) {
      lenis.on('scroll', scheduleSync)
    } else {
      window.addEventListener('scroll', scheduleSync, { passive: true })
    }
    window.addEventListener('resize', refresh)
    const observer = new ResizeObserver(refresh)
    observer.observe(viewport)
    observer.observe(track)
    return () => {
      if (lenis) {
        lenis.off('scroll', scheduleSync)
      } else {
        window.removeEventListener('scroll', scheduleSync)
      }
      window.removeEventListener('resize', refresh)
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [])







  const openDemo = () => { setSubmitted(false); setDemoLoading(false); setModalOpen(true); setMenuOpen(false); setMenuClosing(false) }
  const submitDemo = async (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setDemoLoading(true); await new Promise((resolve) => window.setTimeout(resolve, 900)); setDemoLoading(false); setSubmitted(true) }
  const renderHeroTitleLine = (text: string, accent = false) => <span className={`hero-title-line ${accent ? 'hero-title-accent' : ''}`} aria-hidden="true">{Array.from(text).map((char, index) => <span className="hero-title-char" style={{ animationDelay: `${index * 18}ms` }} key={`${char}-${index}`}>{char === ' ' ? '\u00a0' : char}</span>)}</span>

  return (
    <>
      <div className="page-progress" ref={progressRef} aria-hidden="true" />
      <header className={`site-header ${headerScrolled ? 'is-scrolled' : ''}`}>
        <div className="nav-wrap">
          <a className="brand" href="#top" aria-label="AVERIQ home"><img src="/averiq-logo.png" alt="AVERIQ" /></a>
          <button className="menu-toggle" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} onClick={() => menuOpen ? closeMenu() : setMenuOpen(true)}>{menuOpen ? <X /> : <Menu />}</button>
          <nav className="main-nav" aria-label="Main navigation">
            <a href="#applications">Workflows</a>
            <a href="#solutions">Solutions</a>
            <a href="#tools">Tools</a>
            <a href="#capabilities">Capabilities</a>
            <a href="#approach">How it works</a>
            <a href="#faq">FAQ</a>
            <a href="#about">About</a>
            <button className="nav-cta" onClick={openDemo}>Talk to us <ArrowUpRight size={15} /></button>
          </nav>
        </div>
      </header>
      {menuOpen && <div className={`mobile-menu-backdrop ${menuClosing ? 'is-closing' : ''}`} onMouseDown={(event) => { if (event.target === event.currentTarget) closeMenu() }}><nav className="mobile-menu-panel" aria-label="Mobile navigation"><div className="mobile-menu-head"><a className="brand" href="#top" onClick={closeMenu} aria-label="AVERIQ home"><img src="/averiq-logo.png" alt="AVERIQ" /></a><button onClick={closeMenu} aria-label="Close navigation"><X size={21} /></button></div><div className="mobile-menu-links"><a href="#applications" onClick={closeMenu}>Workflows</a><a href="#solutions" onClick={closeMenu}>Solutions</a><a href="#tools" onClick={closeMenu}>Tools</a><a href="#capabilities" onClick={closeMenu}>Capabilities</a><a href="#approach" onClick={closeMenu}>How it works</a><a href="#faq" onClick={closeMenu}>FAQ</a><a href="#about" onClick={closeMenu}>About</a></div><button className="button button-dark mobile-menu-cta" onClick={openDemo}>Talk to us <ArrowUpRight size={16} /></button></nav></div>}

      <main id="top">
        <section className="hero section-shell">
          <div className="hero-copy">
            <h1 aria-label="Make room for better judgement.">{renderHeroTitleLine('Make room for')}{renderHeroTitleLine('better judgement.', true)}</h1>
            <p className="hero-lede">AVERIQ helps finance professionals move through repetitive work with greater clarity. The software prepares. You review, decide and sign off.</p>
            <div className="hero-actions"><button className="button button-dark" onClick={openDemo}>Request a demo <ArrowRight size={17} /></button><a className="text-link" href="#approach">See how it works <ArrowDownRight size={16} /></a></div>
            <div className="hero-footnote"><ShieldCheck size={16} /> Your expertise stays at the centre of every decision.</div>
          </div>
          <div className="hero-visual" aria-label="Illustration of a financial review workspace">
            <div className="visual-orbit orbit-one" /><div className="visual-orbit orbit-two" />
            <div className="review-depth-plate" aria-hidden="true" />
            <div className="review-window" onPointerMove={(event) => { if (event.pointerType !== 'mouse') return; const rect = event.currentTarget.getBoundingClientRect(); const x = (event.clientX - rect.left) / rect.width - 0.5; const y = (event.clientY - rect.top) / rect.height - 0.5; event.currentTarget.style.setProperty('--dash-rotate-x', `${(-y * 8).toFixed(2)}deg`); event.currentTarget.style.setProperty('--dash-rotate-y', `${(x * 10).toFixed(2)}deg`); event.currentTarget.style.setProperty('--dash-light-x', `${event.clientX - rect.left}px`); event.currentTarget.style.setProperty('--dash-light-y', `${event.clientY - rect.top}px`); event.currentTarget.classList.add('is-pointed') }} onPointerLeave={(event) => { event.currentTarget.style.setProperty('--dash-rotate-x', '0deg'); event.currentTarget.style.setProperty('--dash-rotate-y', '0deg'); event.currentTarget.classList.remove('is-pointed') }}>
              <div className="window-top"><div className="window-dots"><i /><i /><i /></div><span className="live-label"><i /> LIVE WORKFLOW</span><span className="window-avatar">A</span></div>
              <div className="workspace-title"><div><span className="micro-label">APRIL · PROPERTY OPERATIONS</span><h3>Expense review</h3><span className="workspace-subtitle">Documents checked and ready for review</span></div><span className="review-badge"><span /> In review</span></div>
              <div className="workspace-stats"><div><span>Documents</span><strong key={frame.documents} className="live-number">{frame.documents} <small>/ 132</small></strong></div><div><span>Matched</span><strong key={frame.matched} className="live-number">{frame.matched} <small>of {frame.documents}</small></strong></div><div><span>Needs review</span><strong key={frame.attention} className="stat-attention live-number">{frame.attention} <small>items</small></strong></div></div>
              <div className="processing-strip"><div className="processing-copy"><span className="processing-pulse" /><span className="processing-label" key={activityIndex}>{activityLabels[activityIndex]}</span><span className="processing-meta">LIVE</span></div><div className="processing-track"><i /></div></div>
              <div className="document-stack-label"><span>Recent documents</span><span>03 items</span></div>
              <div className="hero-document-list">{frame.rows.map((row, rowIndex) => <div className={`doc-row ${row[3] === 'Review item' ? 'flagged' : ''}`} style={{ animationDelay: `${rowIndex * 120}ms` }} key={`${row[0]}-${liveFrame}`}><span className="doc-icon"><Files size={15} /></span><span className="doc-name">{row[0]}<small>{row[1]}</small></span><strong>{row[2]}</strong>{row[3] === 'Matched' ? <span className="check-state"><Check size={13} /> {row[3]}</span> : <span className="flag-state">{row[3]}</span>}</div>)}</div>
              <div className="window-bottom"><span><span className="tiny-green" /> Draft prepared · {frame.progress}</span><span className="human-signoff"><ShieldCheck size={13} /> Professional sign-off</span></div>
            </div>
            <div className="floating-note" key={frame.alert}><span className="note-icon"><Sparkles size={15} /></span><span><b>{frame.alert}</b><small>{frame.detail}</small></span><ArrowUpRight size={15} /></div>
            <div className="visual-caption">Illustrative sample activity<br />updating continuously.</div>
          </div>
        </section>

        <div className="motion-marquee" aria-label="AVERIQ products and workflows"><div className="marquee-track">{[...marqueeItems, ...marqueeItems].map(({ label, icon: Icon }, index) => <span className="marquee-item" key={`${label}-${index}`}><Icon className="marquee-icon" size={26} strokeWidth={1.7} aria-hidden="true" /><span>{label}</span></span>)}</div></div>

        <section className="applications-section" id="applications">
          <div className="section-shell">
            <div className="editorial-heading"><h2 className="workflows-heading"><span>Built around real</span><span>financial work.</span></h2></div>
            <div className="application-list">{applications.map((application) => <article className="application-card" key={application.number}>
              <div className="application-art"><span className="application-index">{application.number}</span><ProcessSketch variant={application.art} /></div>
              <div className="application-copy"><h3>{application.title}</h3><p>{application.text}</p></div>
            </article>)}</div>
          </div>
        </section>

        <section className="section section-solutions" id="solutions">
          <div className="section-shell"><div className="section-heading"><div><h2>Connected work.<br /><span>From start to sign-off.</span></h2></div><p>Complete workflows for financial processes where the details matter. Bring the work together, prepare it consistently, and keep the professional in control.</p></div>
            <div className="solution-stage" ref={solutionStageRef}>
              <div className="solution-timeline">
                <img className="solution-timeline-image" src="/finance-review.jpg" alt="" aria-hidden="true" />
                <div className="solution-timeline-intro"><span className="solution-timeline-count">{String(activeSolution + 1).padStart(2, '0')} / {String(solutions.length).padStart(2, '0')}</span><div className="solution-timeline-controls"><button type="button" aria-label="Scroll to previous solution" onClick={() => scrollSolutions(-1)}><ArrowRight className="solution-arrow-back" size={15} /></button><button type="button" aria-label="Scroll to next solution" onClick={() => scrollSolutions(1)}><ArrowRight size={15} /></button></div></div>
                <div className="solution-scroll" ref={solutionTrackRef} tabIndex={0} aria-label="End-to-end solutions. Scroll vertically to move horizontally through the connected workflow cards." onKeyDown={(event) => { if (event.key === 'ArrowRight') { event.preventDefault(); scrollSolutions(1) } if (event.key === 'ArrowLeft') { event.preventDefault(); scrollSolutions(-1) } }}>
                  <span className="solution-rail-start" aria-hidden="true" />
                  <div className="solution-track">
                    <span className="solution-rail-base" aria-hidden="true" />
                    <span className="solution-rail-progress" ref={solutionRailProgressRef} aria-hidden="true" />
                    <span className="solution-rail-head" ref={solutionRailHeadRef} aria-hidden="true" />
                    {solutions.map(({ title, text }, index) => <article className={`solution-point ${index % 2 === 0 ? 'is-above' : 'is-below'} ${activeSolution === index ? 'is-active' : ''}`} key={title}>
                      {index === 0 && <img className="solution-image-panel" src="/finance-review.jpg" alt="Colleagues reviewing financial documents together" />}
                      <span className="solution-point-stem" aria-hidden="true" />
                      <span className="solution-point-marker" aria-hidden="true" />
                      <div className="solution-point-copy"><h3>{title}</h3><p>{text}</p></div>
                    </article>)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section tools-section" id="tools"><div className="section-shell"><div className="section-heading tools-heading"><div><h2>Focused help for<br /><span>specific tasks.</span></h2></div></div>
          <div className="tools-grid">{tools.map(([abbr, title, text], i) => <article className="tool-row" key={title}><span className={`tool-mark mark-${i + 1}`}>{abbr}</span><div><h3>{title}</h3><p>{text}</p></div><ArrowUpRight className="tool-arrow" size={17} /></article>)}</div>
        </div></section>

        <section className="section capabilities-section" id="capabilities"><div className="section-shell"><div className="section-heading"><div><h2>Every detail,<br /><span>ready for review.</span></h2></div></div><div className="capability-layout"><div className="capability-list" role="group" aria-label="Explore technology capabilities">{capabilities.map(({ icon: Icon, title }, index) => <button type="button" className={`capability-choice ${activeCapability === index ? 'is-active' : ''}`} aria-pressed={activeCapability === index} onClick={() => setActiveCapability(index)} key={title}><span className="cap-number">0{index + 1}</span><Icon size={17} /><span>{title}</span><ArrowRight size={14} /></button>)}</div><article className="capability-console" aria-live="polite"><div className="console-head"><span className="console-lights"><i /><i /><i /></span><span>{activeCapabilityData.label}</span><span className="sample-chip">ILLUSTRATIVE SAMPLE</span></div><div className="console-body"><div className="console-title"><span className="console-icon"><ActiveCapabilityIcon size={19} /></span><div><span className="micro-label">CAPABILITY {String(activeCapability + 1).padStart(2, '0')} / 05</span><h3>{activeCapabilityData.title}</h3></div></div><p className="console-description">{activeCapabilityData.text}</p><div className="capability-flow"><div className="flow-card"><span className="flow-label">{activeCapabilityData.label}</span><b>{activeCapabilityData.sample}</b><small>{activeCapabilityData.detail}</small></div><span className="flow-arrow"><ArrowRight size={17} /></span><div className="flow-result"><span className="result-check"><Check size={14} /></span><b>{activeCapabilityData.result}</b></div></div><div className="console-foot"><span><span className="tiny-green" /> Drafting remains subject to professional review</span><span>Sample only</span></div></div></article></div></div></section>

        <section className="workflow-section" id="approach"><div className="section-shell"><div className="workflow-intro"><div><h2>From documents<br />to <em>decisions.</em></h2></div></div>
          <nav className="workflow-index" aria-label="Workflow stages">{steps.map(({ number, title }, index) => <a href={`#workflow-${number}`} className={activeStep === index ? 'is-active' : ''} key={number}><span>{number}</span>{title}</a>)}</nav>
          <div className="workflow-line">{steps.map(({ number, title, text, icon: Icon }, index) => <article className={`workflow-step ${activeStep === index ? 'is-active' : ''}`} id={`workflow-${number}`} key={number}><div className="step-marker"><Icon size={19} /></div><h3>{title}</h3><p>{text}</p></article>)}</div>
          <div className="human-note"><span className="human-note-icon"><ShieldCheck size={19} /></span><span><b>Prepared by software. Reviewed by people.</b><small>Final decisions and sign-off stay with the professional.</small></span><span className="human-note-tag">HUMAN IN THE LOOP</span></div>
        </div></section>

        <section className="comparison-section" id="comparison">
          <div className="comparison-ambient-glow" aria-hidden="true" />
          <div className="section-shell comparison-shell">
            <div className="comparison-header">
              <h2>Let software prepare.<br /><span>Let professionals decide.</span></h2>
            </div>

            <div className="comparison-grid">
              <article className="comparison-card prepares">
                <div className="card-ambient-mesh" aria-hidden="true" />
                <div className="comparison-card-head">
                  <div className="comparison-symbol"><Sparkles size={20} /></div>
                  <div className="card-head-titles">
                    <span className="micro-label">SOFTWARE PREPARES</span>
                    <span className="card-stage-chip">STAGE 01 · AUTOMATION ENGINE</span>
                  </div>
                  <span className="card-status-dot pulse-green" title="Automated Engine Active" />
                </div>

                <h3>Repeatable work,<br />made reviewable.</h3>
                <p className="card-subhead">High-speed parsing, rule validation, and clear draft assembly across dense records.</p>

                <ul className="comparison-list">
                  <li><Check size={15} /> <span><b>Extract structured data</b> — Read line items, dates, and amounts from PDFs, contracts & invoices</span></li>
                  <li><Check size={15} /> <span><b>Rule-based cross-checks</b> — Match records against general ledgers and agreed limits</span></li>
                  <li><Check size={15} /> <span><b>Surface variances & gaps</b> — Flag missing attachments and discrepancies with linked source references</span></li>
                  <li><Check size={15} /> <span><b>Assemble review drafts</b> — Format clean schedules and preliminary working papers</span></li>
                </ul>

                <div className="card-footer-pill">
                  <span className="pill-badge">PREPARATION ENGINE</span>
                  <span className="pill-text">Drafts only · Never executes sign-off</span>
                </div>
              </article>

              <div className="comparison-bridge" aria-hidden="true">
                <div className="bridge-line" />
                <div className="bridge-pill">
                  <span className="bridge-indicator" />
                  <span className="bridge-label">CONTINUOUS AUDIT TRAIL</span>
                  <ArrowRight size={13} className="bridge-arrow" />
                </div>
                <div className="bridge-line" />
              </div>

              <article className="comparison-card decides">
                <div className="card-ambient-mesh" aria-hidden="true" />
                <div className="comparison-card-head">
                  <div className="comparison-symbol"><ShieldCheck size={20} /></div>
                  <div className="card-head-titles">
                    <span className="micro-label">PROFESSIONALS DECIDE</span>
                    <span className="card-stage-chip">STAGE 02 · HUMAN OVERSIGHT</span>
                  </div>
                  <span className="card-status-dot pulse-gold" title="Human Authority Retained" />
                </div>

                <h3>Judgement stays<br />with your team.</h3>
                <p className="card-subhead">Contextual evaluation, materiality decisions, and authoritative governance.</p>

                <ul className="comparison-list">
                  <li><Check size={15} /> <span><b>Evaluate highlighted exceptions</b> — Inspect underlying documents and evidence trails in one view</span></li>
                  <li><Check size={15} /> <span><b>Apply professional context</b> — Weigh business nuances, client intent, and accounting standards</span></li>
                  <li><Check size={15} /> <span><b>Resolve subjective items</b> — Apply discretion where automated validation stops</span></li>
                  <li><Check size={15} /> <span><b>Authoritative sign-off</b> — Approve working papers with complete audit trail integrity</span></li>
                </ul>

                <div className="card-footer-pill">
                  <span className="pill-badge pill-gold">SOVEREIGN GOVERNANCE</span>
                  <span className="pill-text">Full practitioner authority</span>
                </div>
              </article>
            </div>
          </div>
        </section>
        <div className="motion-marquee motion-marquee-process" aria-label="Financial automation workflow"><div className="marquee-track">{[...processMarqueeItems, ...processMarqueeItems].map(({ label, icon: Icon }, index) => <span className="marquee-item" key={`${label}-${index}`}><Icon className="marquee-icon" size={26} strokeWidth={1.7} aria-hidden="true" /><span>{label}</span></span>)}</div></div>

        <section className="about-section" id="about"><div className="section-shell about-layout"><div><h2>Built from the work.<br /><span>Designed for what’s next.</span></h2></div><div className="about-copy"><p>The assignment describes AVERIQ as a software company that emerged from the technology department of Alkazim, an accounting and audit firm based in Dubai. The product focus is financial automation: preparing repetitive tasks and making the work clearer to review.</p><p>AVERIQ’ software supports finance professionals, accountants, auditors and property management teams. The people responsible for the work retain context, judgement and final sign-off.</p><a href="#top" className="text-link">Back to the top <ArrowUpRight size={15} /></a></div><div className="about-aside"><span className="aside-symbol">∞</span><span>Technology that<br />makes careful work<br />feel clearer.</span></div></div></section>

        <section className="faq-section" id="faq"><div className="section-shell faq-layout"><div className="faq-heading"><h2>Questions,<br /><span>answered clearly.</span></h2><p>What AVERIQ prepares, who it is for, and where people stay in control.</p></div><div className="faq-list">{faqs.map(({ question, answer }, index) => <article className={`faq-item ${openFaq === index ? 'is-open' : ''}`} key={question}><button type="button" aria-expanded={openFaq === index} onPointerEnter={(event) => { if (event.pointerType !== 'touch') setOpenFaq(index) }} onPointerLeave={(event) => { if (event.pointerType !== 'touch') setOpenFaq((current) => current === index ? null : current) }} onClick={(event) => setOpenFaq(event.detail === 0 && openFaq === index ? null : index)}><span>{question}</span><ChevronDown size={17} /></button>{openFaq === index && <p>{answer}</p>}</article>)}</div></div></section>

        <section className="closing-cta"><div className="section-shell cta-inner"><div><h2>Bring clarity to<br />the work behind<br /><em>every decision.</em></h2></div><div className="cta-aside"><p>See how AVERIQ can support the way your team prepares and reviews financial work.</p><button className="button button-light" onClick={openDemo}>Talk to us <ArrowUpRight size={17} /></button></div><div className="cta-ring" aria-hidden="true" /></div></section>
      </main>

      <footer className="site-footer"><div className="section-shell footer-shell"><div className="footer-main"><div className="footer-brand-block"><a className="brand footer-brand" href="#top" aria-label="AVERIQ home"><img src="/averiq-mark.png" alt="AVERIQ ribbon mark" /></a><p>Financial work, prepared for professional review.</p></div><button className="footer-contact" onClick={openDemo}>Talk to us <ArrowUpRight size={17} /></button></div><div className="footer-bottom"><small>© 2026 AVERIQ · Assignment concept</small><div className="footer-legal"><button onClick={() => setLegalDocument('privacy')}>Privacy policy</button><button onClick={() => setLegalDocument('terms')}>Terms of use</button><a href="#top">Back to top <ArrowUpRight size={14} /></a></div></div></div></footer>

      {modalOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setModalOpen(false) }}><section className="demo-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button className="modal-close" onClick={() => setModalOpen(false)} aria-label="Close dialog"><X size={19} /></button>{submitted ? <div className="modal-success"><span className="success-icon"><Check size={22} /></span><span className="eyebrow">LOCAL PREVIEW</span><h2 id="modal-title">Thanks for exploring.</h2><p>This prototype doesn’t send your details anywhere. Connect a real contact destination before publishing.</p><button className="button button-dark" onClick={() => setModalOpen(false)}>Done <ArrowRight size={16} /></button></div> : <><span className="eyebrow">START A CONVERSATION</span><h2 id="modal-title">Let’s talk about<br />your workflow.</h2><p className="modal-intro">Share a little context to preview the demo request experience.</p><form onSubmit={submitDemo}><label htmlFor="demo-name">Your name</label><input id="demo-name" name="name" placeholder="Name" required /><label htmlFor="demo-email">Work email</label><input id="demo-email" name="email" type="email" placeholder="you@company.com" required /><label htmlFor="demo-interest">I’m interested in</label><div className="select-wrap"><select id="demo-interest" defaultValue=""><option value="" disabled>Select an area</option><option>Audit and assurance</option><option>Finance operations</option><option>Property management</option><option>Other</option></select><ChevronDown size={16} /></div><button className="button button-dark form-submit" type="submit" disabled={demoLoading}>{demoLoading ? <><LoaderCircle className="loading-icon" size={16} /> Preparing preview…</> : <>Preview request <ArrowRight size={16} /></>}</button></form><p className="form-disclaimer"><ShieldCheck size={14} /> Local demo only. No information is sent or stored.</p></>}</section></div>}

      {legalDocument && <div className="modal-backdrop legal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setLegalDocument(null) }}><section className="demo-modal legal-modal" role="dialog" aria-modal="true" aria-labelledby="legal-title"><button className="modal-close" onClick={() => setLegalDocument(null)} aria-label="Close document"><X size={19} /></button><span className="eyebrow">AVERIQ · ASSIGNMENT CONCEPT</span><h2 id="legal-title">{legalDocument === 'privacy' ? 'Privacy policy' : 'Terms of use'}</h2>{legalDocument === 'privacy' ? <div className="legal-copy"><p>This website is an internship assignment concept and local product preview.</p><h3>Information in this demo</h3><p>The Talk to us form only demonstrates browser-side form validation and a confirmation state. It does not transmit or store the details you enter.</p><h3>Financial information</h3><p>Please do not enter confidential, personal, or financial records into this prototype.</p><h3>Before production</h3><p>This prototype notice is not a substitute for AVERIQ’s approved privacy policy. Before collecting information on a published service, the site owner should provide its actual data practices, contact details, and applicable rights.</p></div> : <div className="legal-copy"><p>This website is a demonstration of an AVERIQ assignment concept, not a live financial service.</p><h3>Illustrative content</h3><p>Product descriptions, interface activity, and workflow examples are illustrative. They do not represent a live account, guaranteed availability, or a completed financial review.</p><h3>No professional advice</h3><p>Nothing on this website is accounting, audit, tax, legal, or investment advice. Decisions and sign-off remain with the responsible professional.</p><h3>Demo form</h3><p>The Talk to us form is a local preview only. Submitting it does not send a request or create a customer relationship.</p></div>}<button className="button button-dark legal-done" onClick={() => setLegalDocument(null)}>Close <X size={15} /></button></section></div>}
    </>
  )
}

export default App




